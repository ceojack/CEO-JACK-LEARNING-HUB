export const learningLevels = ['Primary', 'Secondary', 'Higher Education', 'Independent Learner'] as const
export const ageGroups = ['Under 13', '13 - 15', '16 - 18', '19 - 24', '25+'] as const
export const learnerInterests = ['School & Education', 'Web Development', 'Programming', 'AI', 'Business', 'Design'] as const
export const learnerGoals = ['Improve school results', 'Learn digital skills', 'Build projects', 'Start a small idea'] as const

export type LearnerProfile = {
  level: (typeof learningLevels)[number]
  ageGroup: (typeof ageGroups)[number]
  interests: (typeof learnerInterests)[number][]
  goals: (typeof learnerGoals)[number][]
}

function isSubset<T extends string>(values: unknown, allowed: readonly T[], max: number): values is T[] {
  return Array.isArray(values) && values.length <= max && values.every((value) => typeof value === 'string' && allowed.includes(value as T))
}

export function isLearnerProfile(value: unknown): value is LearnerProfile {
  if (!value || typeof value !== 'object') return false
  const profile = value as Record<string, unknown>
  return typeof profile.level === 'string'
    && learningLevels.includes(profile.level as LearnerProfile['level'])
    && typeof profile.ageGroup === 'string'
    && ageGroups.includes(profile.ageGroup as LearnerProfile['ageGroup'])
    && isSubset(profile.interests, learnerInterests, learnerInterests.length)
    && profile.interests.length > 0
    && isSubset(profile.goals, learnerGoals, learnerGoals.length)
    && profile.goals.length > 0
}
