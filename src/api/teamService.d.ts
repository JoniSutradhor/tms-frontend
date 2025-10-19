export function getTeams(): Promise<any>;
export function createTeam(data: any): Promise<any>;
export function updateTeam(id: string, data: any): Promise<any>;
export function deleteTeam(id: string): Promise<any>;
export function bulkDeleteTeams(ids: string[]): Promise<any>;
export function updateStatus(
  id: string,
  field: string,
  value: string
): Promise<any>;
export function reorderTeams(order: string[]): Promise<any>;
export function updateMember(
  teamId: string,
  memberId: string | number,
  data: any
): Promise<any>;
export function deleteMember(
  teamId: string,
  memberId: string | number
): Promise<any>;
