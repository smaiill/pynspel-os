const FreePlan = [
  {
    title: 'variables',
    features: [
      {
        label: 'Inviter des utilisateurs',
        available: true,
      },
      {
        label: "Compteur d'invitations de l'utilisateur",
        available: false,
      },
    ],
  },
  {
    autoModeration: [
      {
        label: 'Bot personnalisé',
        available: false,
      },
    ],
  },
]

const PremiumPlan = [
  {
    title: 'variables',
    features: [
      {
        label: 'Inviter des utilisateurs',
        available: true,
      },
      {
        label: "Compteur d'invitations de l'utilisateur",
        available: true,
      },
    ],
  },
  {
    autoModeration: [
      {
        label: 'Bot personnalisé',
        available: true,
      },
    ],
  },
]

export const Plans = {
  PremiumPlan,
  FreePlan,
}
