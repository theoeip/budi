/**
 * Base class for all known domain-specific errors in BUDI.
 * Differentiates from standard Errors and provides consistent UI presentation.
 */
export class DomainError extends Error {
  public code: string;

  constructor(message: string, code: string = 'DOMAIN_ERROR') {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

export class EmployeeNotFoundError extends DomainError {
  constructor() {
    super('Employee not found', 'EMPLOYEE_NOT_FOUND');
    this.name = 'EmployeeNotFoundError';
    Object.setPrototypeOf(this, EmployeeNotFoundError.prototype);
  }
}

export class DuplicateEmployeeNumberError extends DomainError {
  constructor() {
    super('Employee number already exists', 'DUPLICATE_EMPLOYEE_NUMBER');
    this.name = 'DuplicateEmployeeNumberError';
    Object.setPrototypeOf(this, DuplicateEmployeeNumberError.prototype);
  }
}

export class InvalidEmploymentStatusTransitionError extends DomainError {
  constructor(message: string = 'Invalid employment status transition') {
    super(message, 'INVALID_EMPLOYMENT_STATUS_TRANSITION');
    this.name = 'InvalidEmploymentStatusTransitionError';
    Object.setPrototypeOf(this, InvalidEmploymentStatusTransitionError.prototype);
  }
}

export class DuplicateCapabilityError extends DomainError {
  constructor() {
    super('Employee already has this capability', 'DUPLICATE_CAPABILITY');
    this.name = 'DuplicateCapabilityError';
    Object.setPrototypeOf(this, DuplicateCapabilityError.prototype);
  }
}

export class DuplicateDepartmentAssignmentError extends DomainError {
  constructor() {
    super('Employee is already assigned to this department', 'DUPLICATE_DEPARTMENT_ASSIGNMENT');
    this.name = 'DuplicateDepartmentAssignmentError';
    Object.setPrototypeOf(this, DuplicateDepartmentAssignmentError.prototype);
  }
}

export class DepartmentAlreadyHasHeadError extends DomainError {
  constructor() {
    super('Department already has an active head', 'DEPARTMENT_ALREADY_HAS_HEAD');
    this.name = 'DepartmentAlreadyHasHeadError';
    Object.setPrototypeOf(this, DepartmentAlreadyHasHeadError.prototype);
  }
}

export class EmployeeProfileNotFoundError extends DomainError {
  constructor() {
    super('Employee profile not found', 'EMPLOYEE_PROFILE_NOT_FOUND');
    this.name = 'EmployeeProfileNotFoundError';
    Object.setPrototypeOf(this, EmployeeProfileNotFoundError.prototype);
  }
}

export class EmployeeHRRecordNotFoundError extends DomainError {
  constructor() {
    super('Employee HR record not found', 'EMPLOYEE_HR_RECORD_NOT_FOUND');
    this.name = 'EmployeeHRRecordNotFoundError';
    Object.setPrototypeOf(this, EmployeeHRRecordNotFoundError.prototype);
  }
}
