<template>
  <div class="px-10 py-14 [--color-background:var(--color-background-alpha)]">
    <div
      class="box relative p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md px-6 py-8"
    >
      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-2.5">
          <InputLabel label="Titulo" />
          <InputText placeholder="Titulo del producto" />
        </div>
        <div class="flex flex-col gap-2.5">
          <label
            class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 opacity-70"
            >Email</label
          >
          <input
            type="email"
            placeholder="johndoe@gmail.com"
            class="h-10 w-full rounded-md border bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div class="flex flex-col gap-2.5">
          <label
            class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 opacity-70"
            >When is your event?</label
          >
          <input
            type="date"
            class="h-10 w-full rounded-md border bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div class="flex flex-col gap-2.5">
          <label
            class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 opacity-70"
            >What type of event is it?</label
          >
          <select
            class="bg-(image:--background-image-chevron) bg-[position:calc(100%-theme(spacing.3))_center] bg-[size:theme(spacing.5)] bg-no-repeat relative appearance-none flex h-10 w-full rounded-md border bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option>Corporate Event</option>
            <option>Wedding</option>
            <option>Birthday</option>
            <option>Other</option>
          </select>
        </div>
        <div class="flex flex-col gap-2.5">
          <label
            class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 opacity-70"
            >Additional details</label
          >
          <textarea
            class="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
          </textarea>
        </div>
        <div class="flex gap-2.5 flex-row items-center">
          <div class="bg-background border-foreground/70 relative size-4 rounded-sm border">
            <input
              class="peer relative z-10 size-full cursor-pointer opacity-0"
              type="checkbox"
              id="email-me"
            />
            <div
              class="z-4 bg-foreground invisible absolute inset-0 flex items-center justify-center text-white peer-checked:visible"
            >
              <i
                data-lucide="check"
                class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
              ></i>
            </div>
          </div>
          <label
            class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 opacity-70"
            for="email-me"
            >Email me news and special offers</label
          >
        </div>
        <div class="mt-2 flex gap-3">
          <button
            class="cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-(--color)/20 border-(--color)/60 text-(--color) hover:bg-(--color)/5 [--color:var(--color-primary)] h-10 px-4 py-2"
          >
            <i
              data-lucide="rocket"
              class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
            ></i>
            Register Event
          </button>
          <button
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 bg-background border-(--color)/20 h-10 px-4 py-2"
          >
            <i
              data-lucide="book-check"
              class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
            ></i>
            Show Events
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputLabel from '@/modules/common/components/InputLabel.vue';
import InputText from '@/modules/common/components/InputText.vue';
</script>

<style scoped></style>
