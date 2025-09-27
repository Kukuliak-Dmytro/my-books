"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Section from "@/components/layout/Section"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import { useForm, SubmitHandler, Controller } from "react-hook-form"

export default function AuthorsPage() {
    const [open, setOpen] = useState(false)
    
    type Inputs = {
        authorName: string
        dateOfBirth: string | undefined // Store as YYYY-MM-DD string
        biography: string
    }

    const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm<Inputs>({
        defaultValues: {
            authorName: "",
            dateOfBirth: undefined,
            biography: ""
        }
    })

    const selectedDateString = watch("dateOfBirth")
    const selectedDate = selectedDateString ? new Date(selectedDateString) : undefined
    
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
        // Handle form submission here
    }

    return (
        <Section>
            <h1>Authors</h1>
            <p>List of authors will be displayed here.</p>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger><h3>Create Author</h3></AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 mt-4">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label className='pl-2 mb-1 text-sm' htmlFor="authorName">Author Name</Label>
                                <Input 
                                    id="authorName" 
                                    placeholder="Author name" 
                                    {...register("authorName", { 
                                        required: "Author name is required" 
                                    })}
                                />
                                {errors.authorName && (
                                    <p className="text-sm text-red-500 mt-1">{errors.authorName.message}</p>
                                )}
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="date" className="px-1">
                                    Date of birth
                                </Label>
                                <Controller
                                    name="dateOfBirth"
                                    control={control}
                                    render={({ field }) => (
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    id="date"
                                                    type="button"
                                                    className="w-48 justify-between font-normal bg-transparent hover:scale-100 hover:bg-transparent"
                                                >
                                                    {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            // Convert to YYYY-MM-DD format
                                                            const dateString = date.toISOString().split('T')[0]
                                                            field.onChange(dateString)
                                                            setValue("dateOfBirth", dateString)
                                                        } else {
                                                            field.onChange(undefined)
                                                            setValue("dateOfBirth", undefined)
                                                        }
                                                        setOpen(false)
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                                {errors.dateOfBirth && (
                                    <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="biography" className="pl-2 mb-1 text-sm">Biography</Label>
                                <Textarea 
                                    id="biography" 
                                    placeholder="Author biography" 
                                    {...register("biography", {
                                        required: "Biography is required"
                                    })}
                                />
                                {errors.biography && (
                                    <p className="text-sm text-red-500 mt-1">{errors.biography.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="self-start">Create Author</Button>
                        </form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Section>
    )
}