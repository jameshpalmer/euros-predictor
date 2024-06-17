export interface AuthUser {
	id: string;
	azure_id: string;
	email: string;
	name: string;
	admin: boolean;
}

export interface UserSession {
	id: string;
	user_id: string;
	expires_at: Date;
}

export interface Team {
	id: number;
	name: string;
}

export interface Match {
	id: number;
	home_team_id: number | null; // null means "TBD"
	away_team_id: number | null;
	kickoff: Date;
	round: number;
	home_team_score: number | null; // null if match hasn't been played yet
	away_team_score: number | null;
}

export interface MatchPrediction {
	id: number;
	user_id: string;
	match_id: number;
	home_team_score: number | null; // null if no prediction yet
	away_team_score: number | null;
}
