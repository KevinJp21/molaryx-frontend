"use client";

import { SignUpTemplate } from "@/features";
import { getPublicPlans } from "@/store/plans/plans-slice";
import { useEffect } from "react";
import { useAppDispatch } from "@/store";
export default function SignUpPage() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getPublicPlans());
  }, []);
  return <SignUpTemplate />;
}