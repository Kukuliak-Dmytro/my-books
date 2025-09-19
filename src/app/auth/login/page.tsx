import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import  Form from "next/form"
import Link from "next/link"
export default function Login(){
    return(
      <section className="p-6 flex flex-col gap-6 shadow-double rounded-lg w-[400px]" >
        <h1>Login</h1>
        <Form action="" className="flex flex-col gap-6 max-w-md">
            <div>
                <label htmlFor="username">Email</label>
                <Input type="text" placeholder="Username" />
            </div>
          <div className="flex flex-col gap-4">
              <div>
                  <label htmlFor="email">Password</label>
                  <Input type="email" placeholder="Email" />
              </div>
          </div>
          <Button className="mt-6" variant="default">Login</Button>
          <span className="text-xs mx-auto">Don't have an account? <Link href="/auth/register" className="text-primary underline">Register</Link></span>
        </Form>
      </section>
    )
}