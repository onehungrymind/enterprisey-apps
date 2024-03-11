/* eslint-disable @typescript-eslint/no-empty-function */
import { Challenge } from '@proto/api-interfaces';
import { of } from 'rxjs';

export const mockChallengesFacade = {
  loadChallenges: () => {},
  selectChallenge: () => {},
  deleteChallenge: () => {},
  updateChallenge: () => {},
  createChallenge: () => {},
};

export const mockChallengesService = {
  all: () => of([]),
  find: () => of({ ...mockChallenge }),
  create: () => of({ ...mockChallenge }),
  update: () => of({ ...mockChallenge }),
  delete: () => of({ ...mockChallenge }),
};

export const mockChallenge: Challenge = {
  id: '0',
  title: 'mock',
  description: 'mock',
  completed: false,
  repo_url: 'mock',
  comment: 'mock',
  user_id: 'mock',
};

export const mockEmptyChallenge: Challenge = {
  id: null,
  title: 'mockEmpty',
  description: 'mockEmpty',
  completed: false,
  repo_url: 'mockEmpty',
  comment: 'mockEmpty',
  user_id: 'mockEmpty',
};
