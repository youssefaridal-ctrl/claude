import { Err, Ok } from '../../core/types/result';
import type { Result } from '../../core/types/result';
import type { DomainError } from '../../domain/shared/errors/domain-error';
import { UnknownError } from '../../domain/shared/errors/domain-error';
import { useAppStore } from '../../store';

interface Apply503020Input {
  needsName: string;
  wantsName: string;
  savingsName: string;
}

export async function apply503020(input: Apply503020Input): Promise<Result<void, DomainError>> {
  try {
    const store = useAppStore.getState();
    const existing = [...store.categories];

    // Delete all existing categories first
    await Promise.all(existing.map((c) => store.deleteCategory(c.id)));

    // Add the three 50/30/20 categories with fresh IDs
    await store.addCategory({
      name: input.needsName,
      percentage: 50,
      amount: 0,
      color: '#6366F1',
      icon: '🏠',
    });
    await store.addCategory({
      name: input.wantsName,
      percentage: 30,
      amount: 0,
      color: '#8B5CF6',
      icon: '🎮',
    });
    await store.addCategory({
      name: input.savingsName,
      percentage: 20,
      amount: 0,
      color: '#10B981',
      icon: '💰',
    });

    return Ok(undefined);
  } catch (cause) {
    return Err(UnknownError(cause));
  }
}
