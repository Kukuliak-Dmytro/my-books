"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import  Form from "next/form"
import Link from "next/link"
import { loginUser } from "@/services/auth"
import { useForm, SubmitHandler } from "react-hook-form"
type Inputs = {
  email: string
  password: string
}


export default function Login(){
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => loginUser(data.email, data.password)
  
    return(
      <section className="p-6 flex flex-col gap-6 shadow-double rounded-lg w-[400px]" >
        <h1>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-md">
            
          <div className="flex flex-col gap-4">
              <div>
                  <label htmlFor="email">Email</label>
                  <Input type="email" {...register("email")} placeholder="Email" />
              </div>
              <div>
                  <label htmlFor="password">Password</label>
                  <Input type="password" {...register("password")} placeholder="Password" />
              </div>
              
          </div>
          <Button className="mt-6" variant="default">Login</Button>
          <span className="text-xs mx-auto">Don't have an account? <Link href="/auth/register" className="text-primary underline">Register</Link></span>
        </form>
      </section>
    )
  
}