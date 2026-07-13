import { I18nManager } from 'react-native';
import { Err, Ok } from '../../core/types/result';
import type { Result } from '../../core/types/result';
import type { DomainError } from '../../domain/shared/errors/domain-error';
import { UnknownError, ValidationError } from '../../domain/shared/errors/domain-error';
import i18n, { LANGUAGES } from '../../i18n';
import type { Language } from '../../i18n';
import { useAppStore } from '../../store';

export interface LanguageUpdateResult {
  /** True when RTL direction changed — caller should prompt user to restart. */
  restartRequired: boolean;
}

/**
 * Persist the selected language, update the i18next runtime locale,
 * and apply React Native's RTL setting.
 *
 * Text changes take effect immediately. Layout direction changes
 * (LTR ↔ RTL) require an app restart — `restartRequired` signals this.
 */
export async function updateLanguage(
  lang: Language
): Promise<Result<LanguageUpdateResult, DomainError>> {
  const langDef = LANGUAGES.find((l) => l.code === lang);
  if (!langDef) {
    return Err(ValidationError(`Unsupported language: ${lang}`));
  }

  const currentLang = useAppStore.getState().user.language;
  const currentLangDef = LANGUAGES.find((l) => l.code === currentLang);
  const rtlChanged = langDef.rtl !== (currentLangDef?.rtl ?? false);

  try {
    await useAppStore.getState().updateUser({ language: lang });
    await i18n.changeLanguage(lang);
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(langDef.rtl);
    return Ok({ restartRequired: rtlChanged });
  } catch (cause) {
    return Err(UnknownError(cause));
  }
}
