"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import  Form from "next/form"
import Link from "next/link"
import { registerUser } from "@/services/auth"
import { useForm, SubmitHandler } from "react-hook-form"
type Inputs = {
  full_name: string
  email: string
  password: string
  confirmPassword: string
}


export default function Register(){
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => registerUser(data.full_name, data.email, data.password)
  
    return(
      <section className="p-6 flex flex-col gap-6 shadow-double rounded-lg w-[400px]" >
        <h1>Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-md">
            <div>
                <label htmlFor="username">Full name</label>
                <Input type="text" {...register("full_name")} placeholder="Full name" />
            </div>
          <div className="flex flex-col gap-4">
              <div>
                  <label htmlFor="email">Email</label>
                  <Input type="email" {...register("email")} placeholder="Email" />
              </div>
              <div>
                  <label htmlFor="password">Password</label>
                  <Input type="password" {...register("password")} placeholder="Password" />
              </div>
              <div>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <Input type="password" {...register("confirmPassword")} placeholder="Confirm Password" />
              </div>
          </div>
          <Button className="mt-6" variant="default">Register</Button>
          <span className="text-xs mx-auto">Already have an account? <Link href="/auth/login" className="text-primary underline">Login</Link></span>
        </form>
      </section>
    )
  
}