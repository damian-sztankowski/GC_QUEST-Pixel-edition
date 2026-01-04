import { Question } from '../types';
import { EASY_QUESTIONS } from './easy';
import { NORMAL_QUESTIONS } from './normal';
import { HARD_QUESTIONS } from './hard';
import { SECRET_QUESTIONS } from './secret';

export const STATIC_QUESTION_BASE: Record<string, Record<number, Question[]>> = {
  EASY: EASY_QUESTIONS,
  NORMAL: NORMAL_QUESTIONS,
  HARD: HARD_QUESTIONS,
  SECRET: SECRET_QUESTIONS
};