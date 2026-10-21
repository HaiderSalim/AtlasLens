import React, { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import WizardScreen from './index';
import { useIntakeWizardStore } from '@/store/useIntakeWizardStore';

export default function WizardStepRouter() {
  const { step } = useLocalSearchParams<{ step: string }>();
  const setStep = useIntakeWizardStore((state) => state.setStep);

  useEffect(() => {
    if (step) {
      const stepNum = parseInt(step, 10);
      if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= 4) {
        setStep(stepNum);
      }
    }
  }, [step, setStep]);

  return <WizardScreen />;
}

