import type {RewardCondition} from "@/assets/data/foundation/foundation";

export interface GuidingSessionRole {
    account: string
    accountRole_id: string
}

export interface GuidingSessionPayload {
    roles: GuidingSessionRole[];
    guidingCategory_ids: string[];
    fromDate: Date;
    toDate?: Date | null;
    id?: string;
    completed?: boolean;
}

export interface GuidingSession extends Omit<GuidingSessionPayload, 'id' | 'completed'> {
    id: string;
    completed: boolean;
}