export interface ActionLog {
  actionId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  timestamp: string;
}
