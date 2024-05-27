export type UserPrediction = {
	prediction_id: number;
	kickoff_utc: Date;
	round: number;
	location: string;
	description: string;
	home_team_name: string;
	away_team_name: string;
	home_team_score: number | null;
	away_team_score: number | null;
	home_team_score_prediction: number | null;
	away_team_score_prediction: number | null;
	match_played: boolean;
};
