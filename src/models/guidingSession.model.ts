export interface GuidingSessionRole {
    account: string
    accountRole_id: string
}

export interface GuidingSessionPayload {
    roles: GuidingSessionRole[];
    guidingCategory_ids: string[];
    fromDate: Date;
    toDate?: Date | null;
}

export interface GuidingSession extends GuidingSessionPayload {
    id: string;
    completed: boolean;
}