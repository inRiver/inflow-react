import { createContext, useContext } from 'react';
import type { CustomizationMethodId, CustomizationValuesByMethod } from './ComponentCustomizationPanel';

interface CustomizationPlaygroundContextValue {
  componentId: string;
  activeMethod: CustomizationMethodId;
  valuesByMethod: CustomizationValuesByMethod;
  onActiveMethodChange: (method: CustomizationMethodId) => void;
  onValuesByMethodChange: (valuesByMethod: CustomizationValuesByMethod) => void;
}

export const CustomizationPlaygroundContext = createContext<CustomizationPlaygroundContextValue | null>(null);

export const useCustomizationPlayground = () => useContext(CustomizationPlaygroundContext);
