import { BLOCK1 } from './block1';
import { BLOCK2 } from './block2';
import { BLOCK3 } from './block3';
import { BLOCK4 } from './block4';
import { BLOCK5 } from './block5';
import type { Lesson } from './types';

export type { Lesson, LessonQuiz } from './types';

export const LESSONS: Lesson[] = [...BLOCK1, ...BLOCK2, ...BLOCK3, ...BLOCK4, ...BLOCK5];

export const lessonFor = (day: number): Lesson | undefined => LESSONS.find((l) => l.day === day);
