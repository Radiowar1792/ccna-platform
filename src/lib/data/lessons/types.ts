// Leçons courtes en anglais pour chaque vidéo (anglais simple, niveau B1-B2).
// "fr" = explication détaillée en français, avec les termes techniques gardés en anglais.
export interface LessonQuiz {
	q: string;
	o: string[];
	a: number;
	why: string;
}

export interface Lesson {
	day: number;
	summary: string;
	points: string[];
	vocab: [en: string, fr: string][];
	commands?: string[];
	hint: string;
	fr: string;
	quiz: LessonQuiz[];
}
