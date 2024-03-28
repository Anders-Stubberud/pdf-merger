'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRef, useState } from "react";
import { CardWithForm } from "@/components/card-form";


export default function IndexPage() {

  return (
    <div className="flex justify-center mt-14">
      <CardWithForm></CardWithForm>
    </div>
  );
}
