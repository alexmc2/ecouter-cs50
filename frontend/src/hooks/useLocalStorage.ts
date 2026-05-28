
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import {
  readLocalStorageValue,
  writeLocalStorageValue,
} from '../storage/localStorage';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): readonly [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() =>
    readLocalStorageValue(key, defaultValue),
  );

  useEffect(() => {
    writeLocalStorageValue(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
