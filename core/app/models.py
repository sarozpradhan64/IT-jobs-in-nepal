from datetime import datetime
from typing import List
from sqlalchemy import Table, Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

# Association table for Job <-> Skill
job_skills = Table(
    "job_skills",
    Base.metadata,
    Column("job_id", Integer, ForeignKey("jobs.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)

class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    website: Mapped[str | None] = mapped_column(String(500), nullable=True)
    career_page: Mapped[str | None] = mapped_column(String(500), nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    overview: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    jobs: Mapped[List["Job"]] = relationship(back_populates="company", cascade="all, delete-orphan")


class ScraperSource(Base):
    __tablename__ = "scraper_sources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    source_type: Mapped[str] = mapped_column(String(50), nullable=False)  # portal, linkedin, company
    base_url: Mapped[str] = mapped_column(String(500), nullable=False)
    last_scraped_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="active", nullable=False)  # active, error, disabled

    jobs: Mapped[List["Job"]] = relationship(back_populates="source")


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)

    jobs: Mapped[List["Job"]] = relationship(
        secondary=job_skills, back_populates="skills"
    )


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    company_id: Mapped[int] = mapped_column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    location: Mapped[str] = mapped_column(String(255), default="Nepal", nullable=False)
    employment_type: Mapped[str] = mapped_column(
        String(50), default="full-time", nullable=False
    )  # full-time, part-time, internship, contract
    experience_level: Mapped[str] = mapped_column(
        String(50), default="mid", nullable=False
    )  # junior, mid, senior, lead
    salary: Mapped[str | None] = mapped_column(String(100), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    requirements: Mapped[str | None] = mapped_column(Text, nullable=True)
    responsibilities: Mapped[str | None] = mapped_column(Text, nullable=True)
    posted_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    expiry_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    apply_url: Mapped[str] = mapped_column(String(1000), unique=True, nullable=False)
    source_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("scraper_sources.id", ondelete="SET NULL"), nullable=True
    )
    source_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    remote_status: Mapped[str] = mapped_column(
        String(50), default="onsite", nullable=False
    )  # onsite, hybrid, remote
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    company: Mapped["Company"] = relationship(back_populates="jobs")
    source: Mapped["ScraperSource | None"] = relationship(back_populates="jobs")
    skills: Mapped[List["Skill"]] = relationship(
        secondary=job_skills, back_populates="jobs"
    )

    @property
    def source_name(self) -> str:
        return self.source.name if self.source else "Career Page"

# Indexes for PostgreSQL Full-Text Search
Index("idx_jobs_title_gin", Job.title, postgresql_using="gin")
Index("idx_jobs_description_gin", Job.description, postgresql_using="gin")
Index("idx_jobs_requirements_gin", Job.requirements, postgresql_using="gin")
