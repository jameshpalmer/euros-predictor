export interface MatchPredictionData {
	homeTeamName: string | null;
	awayTeamName: string | null;
	kickoff: Date;
	round: number;
	homeTeamScorePrediction: number | null;
	awayTeamScorePrediction: number | null;
	homeTeamScore: number | null;
	awayTeamScore: number | null;
}
