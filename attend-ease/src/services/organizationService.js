import { v4 as uuidv4 } from 'uuid'
import { getItem, setItem } from '../utils/storage'

const ORGANIZATION_KEY = 'organizationProfile'
const BRANCHES_KEY = 'organizationBranches'
const DEPARTMENTS_KEY = 'organizationDepartments'
const TEAMS_KEY = 'organizationTeams'

const defaults = {
  organization: { name: 'AttendEase Industries', registrationNumber: 'AE-2026-001', industry: 'Technology & Services', timezone: 'Asia/Colombo', workWeek: 'Monday - Friday', address: 'Colombo, Sri Lanka' },
  branches: [{ id: 'branch-hq', name: 'Colombo Headquarters', location: 'Colombo', manager: 'System Admin', status: 'active' }],
  departments: [{ id: 'dept-eng', name: 'Engineering', head: 'System Admin', costCenter: 'ENG-001' }, { id: 'dept-hr', name: 'Human Resources', head: 'System Admin', costCenter: 'HR-001' }, { id: 'dept-sales', name: 'Sales', head: 'System Admin', costCenter: 'SAL-001' }],
  teams: [{ id: 'team-core', name: 'Core Operations', department: 'Engineering', lead: 'System Admin', members: 3 }],
}

/** Return the organization profile. */
export function getOrganization() { return getItem(ORGANIZATION_KEY, defaults.organization) }
/** Save organization profile changes. */
export function updateOrganization(updates) { const organization = { ...getOrganization(), ...updates }; setItem(ORGANIZATION_KEY, organization); return organization }
/** Return all organization branches. */
export function getBranches() { return getItem(BRANCHES_KEY, defaults.branches) }
/** Add an organization branch. */
export function addBranch(branch) { const created = { id: uuidv4(), status: 'active', ...branch }; setItem(BRANCHES_KEY, [...getBranches(), created]); return created }
/** Return all departments. */
export function getDepartments() { return getItem(DEPARTMENTS_KEY, defaults.departments) }
/** Add a department. */
export function addDepartment(department) { const created = { id: uuidv4(), ...department }; setItem(DEPARTMENTS_KEY, [...getDepartments(), created]); return created }
/** Return all teams. */
export function getTeams() { return getItem(TEAMS_KEY, defaults.teams) }
/** Add a team. */
export function addTeam(team) { const created = { id: uuidv4(), members: 0, ...team }; setItem(TEAMS_KEY, [...getTeams(), created]); return created }
