type FlagProps = {
  size?: number
}

export const FrenchFlag = ({ size = 30 }: FlagProps) => {
  return (
    <svg
      width={size}
      height={(2 / 3) * size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3 2"
    >
      <rect x="0" y="0" width="1" height="2" fill="#002169" />
      <rect x="1" y="0" width="1" height="2" fill="#fff" />
      <rect x="2" y="0" width="1" height="2" fill="#e20613" />
    </svg>
  )
}

export const BritishFlag = ({ size = 30 }: FlagProps) => {
  return (
    <svg
      width={size}
      height={(2 / 3) * size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 40"
    >
      <clipPath id="a">
        <path d="M0 0v40h60V0z" />
      </clipPath>
      <clipPath id="b">
        <path d="M30 20h30v20zv20H0zH0V0zV0h30z" />
      </clipPath>
      <g clipPath="url(#a)">
        <path d="M0 0v40h60V0z" fill="#001B69" />
        <path d="m0 0 60 40m0-40L0 40" stroke="#fff" strokeWidth="6" />
        <path
          d="m0 0 60 40m0-40L0 40"
          clipPath="url(#b)"
          stroke="#C9072A"
          strokeWidth="4"
        />
        <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v40M0 20h60" stroke="#C9072A" strokeWidth="6" />
      </g>
    </svg>
  )
}
