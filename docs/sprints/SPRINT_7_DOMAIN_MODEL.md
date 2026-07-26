# Sprint 7 Domain Model Design: School Management Foundation

## 1. Aggregate Roots
In the BUDI platform, the following entities serve as Aggregate Roots (AR). They define transactional boundaries, enforce domain invariants, and act as the primary entry point for repositories.

- **School (Tenant AR):** The highest-level aggregate. It owns all subsequent data. A School represents a single isolated tenant business unit.
- **AcademicYear (Temporal AR):** Represents a specific school calendar cycle. It owns its lifecycle and dictates the temporal boundaries for scheduling and enrollment.
- **Semester (Sub-temporal AR):** While logically a child of AcademicYear, treating Semester as its own AR simplifies grading and reporting domains which rely strictly on semester boundaries rather than full years.
- **Department (Structural AR):** Represents a static organizational unit (e.g., "Science Faculty" or "Junior High"). It transcends time and owns its structural configuration.
- **Subject (Curriculum AR):** Represents a course offering. It transcends academic years, allowing historical grading data to persist even if a subject is later retired.
- **Class (Operational AR):** The intersection of Time (`AcademicYear`), Structure (`Department`), and People (`homeroom_teacher`). It is the primary operational container for students.

## 2. Entity Relationships & Dependencies
- **Many-to-One:**
  - `AcademicYear` *belongs to* `School`
  - `Semester` *belongs to* `AcademicYear` (and `School`)
  - `Department` *belongs to* `School`
  - `Subject` *belongs to* `Department` (and `School`)
  - `Class` *belongs to* `AcademicYear` and `Department` (and `School`)
- **Future Many-to-Many:**
  - `ClassSubject`: A mapping table (Sprint 10) associating a `Class` with a `Subject` for scheduling.
  - `StudentEnrollment`: A mapping table (Sprint 8) associating a `Student` (Profile) to a `Class`.
- **Lifecycle Dependencies:**
  All entities rely on `ON DELETE RESTRICT`. A `Department` cannot be soft-deleted if a `Class` still references it. An `AcademicYear` cannot be soft-deleted if `Semesters` or `Classes` reference it.

## 3. Entity Responsibilities

### **AcademicYear**
- **Purpose:** Defines the temporal boundaries of a school year.
- **Lifecycle:** Created before the year starts, activated during the year, closed/archived when finished.
- **Business rules:** Dates cannot overlap with other active years.
- **State changes:** Draft -> Active -> Closed -> Archived.
- **Deletion policy:** Soft-delete only. Restricted if semesters or classes exist.

### **Semester**
- **Purpose:** Divides an academic year into grading/billing periods.
- **Lifecycle:** Inherits bounds from AcademicYear. 
- **Business rules:** Dates must fall strictly within the parent AcademicYear's dates.
- **State changes:** Draft -> Active -> Closed.
- **Deletion policy:** Soft-delete only. Restricted if grades or attendance logs exist.

### **Department**
- **Purpose:** Categorizes educational levels or faculties.
- **Lifecycle:** Static long-term existence. Rarely deleted.
- **Business rules:** Names and codes must be unique per school.
- **State changes:** Active -> Inactive.
- **Deletion policy:** Soft-delete only. Restricted if classes or subjects belong to it.

### **Class**
- **Purpose:** Groups students for operational logistics.
- **Lifecycle:** Created for a specific AcademicYear. Re-created/cloned each year.
- **Business rules:** Capacity must not be exceeded. Must belong to an AcademicYear.
- **State changes:** Active -> Inactive -> Archived.
- **Deletion policy:** Soft-delete only. Restricted if students are enrolled.

### **Subject**
- **Purpose:** Defines the curriculum catalog.
- **Lifecycle:** Long-term. A subject taught in 2024 is the same entity in 2026.
- **Business rules:** Must have a unique code per school.
- **State changes:** Active -> Retired (Inactive).
- **Deletion policy:** Soft-delete only. Restricted if past grades exist.

## 4. Value Objects
To ensure data integrity and rich domain validation, the following fields act as Value Objects:
- **AcademicYearName:** Must follow specific formatting (e.g., "2025/2026").
- **SemesterType:** Enum constraint (`'Odd'`, `'Even'`, `'Short'`, `'Summer'`).
- **DepartmentCode:** Uppercase alphanumeric, no spaces, length 2-5 (e.g., `IPA`, `IPS`, `SMP`).
- **SubjectCode:** Uppercase alphanumeric, prefix standard (e.g., `MATH-101`).
- **ClassCode:** Standardized identifier combining department and grade (e.g., `10-IPA-1`).
- **SchoolCode:** Globally unique, alphanumeric tenant identifier.

## 5. Domain Events
Future system integrations (via Supabase Webhooks/Edge Functions) will broadcast:
- `AcademicYearActivated`: Triggers billing generation for Sprint 9.
- `SemesterActivated`: Triggers new attendance ledger creation.
- `DepartmentCreated`: Triggers default subject template population.
- `ClassArchived`: Triggers final grade lock-in.
- `SubjectRetired`: Removes subject from active scheduling selectors.

## 6. Invariants
- Only ONE active `AcademicYear` may exist per school at any given time.
- Only ONE active `Semester` may exist per school at any given time.
- A `Class` belongs to exactly one `AcademicYear`.
- A `Class` belongs to exactly one `Department`.
- A `Semester`'s start/end dates must not exceed its parent `AcademicYear`'s bounds.
- A `Subject` cannot be deleted if historical grades exist (enforced by `RESTRICT`).

## 7. State Machine

### Academic Year
```text
[Draft] : Setup phase (classes mapped, no students enrolled)
   ↓
[Active] : Current year (billing running, attendance active)
   ↓
[Closed] : Year ended (grading finalized, read-only)
   ↓
[Archived] : Hidden from default UI views
```

### Semester
```text
[Draft] : Setup phase (schedules being generated)
   ↓
[Active] : Current term (grading open, attendance active)
   ↓
[Closed] : Term ended (grades locked)
```

## 8. Future Modules Mapping
This domain establishes the bedrock for all future functionality:
- **Enrollment (Sprint 8):** Maps `Student` to `Class`.
- **Finance (Sprint 9):** Generates invoices based on `Department` pricing and `AcademicYear` triggers.
- **Scheduling (Sprint 10):** Maps `Teacher` to `Subject` to `Class` within a `Semester`.
- **Attendance (Sprint 11):** Daily logs pivot on `Class` and `Semester`.
- **Grades (Sprint 12):** Transcripts pull from `Subject` and group by `Semester`.
- **Parent/Student Portal (Sprint 14-15):** UIs filter automatically by the `Active` `AcademicYear` and `Semester`.

## 9. DDD Review: Minimizing Coupling
These aggregate boundaries are intentionally designed to minimize tight coupling:
- **Separation of Structure from Time:** By making `Subject` and `Department` independent of `AcademicYear`, the school does not need to duplicate its entire curriculum catalog every year.
- **Operational Isolation:** `Class` is the only entity that bridges Time (`AcademicYear`) and Structure (`Department`). This allows historical classes to be archived cleanly without corrupting the static structural entities.
- **Tenant Isolation:** Every aggregate root contains `school_id`. This prevents cross-tenant data spillage without requiring complex contextual joins through multiple parent tables.
