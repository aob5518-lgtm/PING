import { User } from '@/types';

export type MatchResult = { user: User; score: number; sharedInterests: string[]; profileFit: boolean };

const normalize = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, ' ');
const matches = (left: string, right: string) => {
  const a = normalize(left);
  const b = normalize(right);
  return a === b || a.includes(b) || b.includes(a);
};

export function scorePeople(currentUser: User, candidates: User[]): MatchResult[] {
  return candidates.map(user => {
    const sharedInterests = currentUser.interests.filter(interest => user.interests.some(candidate => matches(interest, candidate)));
    const desired = currentUser.lookingFor.filter(wanted => [...user.interests, ...user.lookingFor].some(candidate => matches(wanted, candidate))).length;
    const reciprocal = user.lookingFor.filter(wanted => currentUser.interests.some(interest => matches(wanted, interest))).length;
    return { user, sharedInterests, profileFit: desired > 0, score: sharedInterests.length * 3 + desired * 2 + reciprocal };
  }).sort((a, b) => b.score - a.score || a.user.displayName.localeCompare(b.user.displayName));
}
