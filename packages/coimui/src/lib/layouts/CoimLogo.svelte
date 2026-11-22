<script lang="ts">
  import { cn } from "../utilities/utils.js";

  interface Props {
    classNameFull?: string;
    classNameMobile?: string;
    brandText?: string;
  }

  let {
    classNameFull = "inline-block",
    classNameMobile = "hidden",
    brandText = "CoimUI",
  }: Props = $props();

  const uid = $props.id();
  const gradientID = `${uid}-full`;
  const gradientIDMobile = `${uid}-mobile`;
</script>

<span class="inline-flex items-center">
  <svg
    class={cn("fill-current", classNameFull)}
    width="96"
    height="27"
    viewBox="0 0 96 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={brandText}
  >
    <path
      d="M11 1.25C13.8 1.25 16.4 2.4 18.25 4.45L20.1 6.5C21.85 8.45 21.85 11.4 20.1 13.35L17.9 15.8C16.75 17.05 14.8 17.05 13.65 15.8C12.55 14.6 12.55 12.7 13.65 11.5L14.55 10.5C15.1 9.9 15.1 8.95 14.55 8.35L13.15 6.8C11.95 5.45 9.85 5.45 8.65 6.8L6.65 9.05C5.5 10.3 5.5 12.2 6.65 13.45L8.65 15.7C9.85 17.05 11.95 17.05 13.15 15.7L14.2 14.55C15.3 13.35 17.2 13.35 18.3 14.55C19.45 15.8 19.45 17.8 18.3 19.05L17.6 19.8C14.1 23.7 7.9 23.7 4.4 19.8L2.25 17.4C-0.45 14.4 -0.45 9.85 2.25 6.85L4.4 4.45C6.15 2.45 8.5 1.25 11 1.25Z"
      fill="url(#{gradientID})"
    />
    <circle cx="11.2" cy="11.25" r="2.2" class="fill-background-paper" />
    <text
      x="27"
      y="19.5"
      class="fill-text-primary font-heading"
      font-family="var(--coim-font-heading, 'Urbanist', sans-serif)"
      font-size="18.5"
      font-weight="800"
      letter-spacing="-0.03em"
    >
      {brandText}
    </text>
    <defs>
      <linearGradient id={gradientID} x1="11" y1="1" x2="11" y2="25" gradientUnits="userSpaceOnUse">
        <stop stop-color="hsl(var(--primary-light))" />
        <stop offset="1" stop-color="hsl(var(--primary-dark))" />
      </linearGradient>
    </defs>
  </svg>

  <svg
    class={cn("fill-current", classNameMobile)}
    width="22"
    height="27"
    viewBox="0 0 22 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={brandText}
  >
    <path
      d="M11 1.25C13.8 1.25 16.4 2.4 18.25 4.45L20.1 6.5C21.85 8.45 21.85 11.4 20.1 13.35L17.9 15.8C16.75 17.05 14.8 17.05 13.65 15.8C12.55 14.6 12.55 12.7 13.65 11.5L14.55 10.5C15.1 9.9 15.1 8.95 14.55 8.35L13.15 6.8C11.95 5.45 9.85 5.45 8.65 6.8L6.65 9.05C5.5 10.3 5.5 12.2 6.65 13.45L8.65 15.7C9.85 17.05 11.95 17.05 13.15 15.7L14.2 14.55C15.3 13.35 17.2 13.35 18.3 14.55C19.45 15.8 19.45 17.8 18.3 19.05L17.6 19.8C14.1 23.7 7.9 23.7 4.4 19.8L2.25 17.4C-0.45 14.4 -0.45 9.85 2.25 6.85L4.4 4.45C6.15 2.45 8.5 1.25 11 1.25Z"
      fill="url(#{gradientIDMobile})"
    />
    <circle cx="11.2" cy="11.25" r="2.2" class="fill-background-paper" />
    <defs>
      <linearGradient id={gradientIDMobile} x1="11" y1="1" x2="11" y2="25" gradientUnits="userSpaceOnUse">
        <stop stop-color="hsl(var(--primary-light))" />
        <stop offset="1" stop-color="hsl(var(--primary-dark))" />
      </linearGradient>
    </defs>
  </svg>
</span>
