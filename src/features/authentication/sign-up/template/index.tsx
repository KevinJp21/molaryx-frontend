'use client'

import { SIGN_UP_STEPS, STEP_FIELDS, SIGN_UP_DEFAULT_VALUES} from "../consts";
import { StepIndicator } from "../components";
import { useState } from "react";

export const SignUpTemplate = () => {
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState<{ consultoryName: string; email:string } | null>(null);

    
  return (
    <div>
      <h1>Sign Up</h1>
    </div>
  );
};

export default SignUpTemplate;