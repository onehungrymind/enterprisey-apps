import { createSelector } from '@ngrx/store';
import { getChallengesState } from './state';
import { ChallengesState, challengesAdapter } from './challenges.reducer';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = challengesAdapter.getSelectors();

const getChallengesSlice = createSelector(getChallengesState, (state) => state.challenges);

export const getChallengeIds = createSelector(getChallengesSlice, selectIds);
export const getChallengesEntities = createSelector(getChallengesSlice, selectEntities);
export const getAllChallenges = createSelector(getChallengesSlice, selectAll);
export const getChallengesTotal = createSelector(getChallengesSlice, selectTotal);
export const getSelectedChallengeId = createSelector(getChallengesSlice, (state: ChallengesState) => state.selectedId);

export const getChallengesLoaded = createSelector(
  getChallengesSlice,
  (state: ChallengesState) => state.loaded
);

export const getChallengesError = createSelector(
  getChallengesSlice,
  (state: ChallengesState) => state.error
);

export const getSelectedChallenge = createSelector(
  getChallengesEntities,
  getSelectedChallengeId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
