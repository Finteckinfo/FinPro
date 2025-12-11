<template>
  <div class="features-grid">
    <article
      v-for="feature in features"
      :key="feature.title"
      class="feature-card"
    >
      <div class="feature-icon">
        <v-icon size="24" color="#6b7280">
          {{ feature.icon }}
        </v-icon>
      </div>
      <h3 class="feature-title">{{ feature.title }}</h3>
      <p class="feature-description">{{ feature.description }}</p>
    </article>
  </div>
</template>

<script setup lang="ts">
interface Feature {
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    title: 'Secure Escrow',
    description:
      'Safeguard every payment with on-chain escrow and automated release rules that give both teams and contributors confidence.',
    icon: 'mdi-shield-lock',
  },
  {
    title: 'Web3 Native',
    description:
      'Instant account verification, FIN token balances, and signature-based approvals—built for a borderless workforce.',
    icon: 'mdi-wallet-plus',
  },
  {
    title: 'Remote Alignment',
    description:
      'Keep work private to the people involved. Owners, managers, creators, and assignees collaborate without noisy spillover.',
    icon: 'mdi-account-group',
  },
  {
    title: 'Guaranteed Payouts',
    description:
      'Task states sync with escrow so milestones trigger real payouts without manual intervention or accounting delays.',
    icon: 'mdi-rocket-launch',
  },
  {
    title: 'Operational Clarity',
    description:
      'Surface live obligations, processing transfers, and released funds in one glance with our escrow analytics widgets.',
    icon: 'mdi-chart-box',
  },
  {
    title: 'Global Ecosystem',
    description:
      'Match contributors and projects in any market, with instant onboarding flows and localized compliance baked into the platform.',
    icon: 'mdi-earth',
  },
];
</script>

<style scoped>
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: var(--erp-card-bg, #ffffff);
  border: 1px solid var(--erp-border, #e2e8f0);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.dark-theme .feature-card {
  background-color: var(--erp-card-bg, #1e293b);
  border-color: var(--erp-border, #334155);
}

.feature-card:hover {
  border-color: var(--erp-accent-green, #5BC85B);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.dark-theme .feature-card:hover {
  border-color: var(--erp-accent-green, #5BC85B);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background-color: var(--erp-accent-light, rgba(91, 200, 91, 0.1));
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  background-color: var(--erp-accent-green, #5BC85B);
  transform: scale(1.1);
}

.feature-card:hover .feature-icon :deep(.v-icon) {
  color: #ffffff !important;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: var(--erp-heading, #0f172a);
  letter-spacing: -0.01em;
}

.dark-theme .feature-title {
  color: var(--erp-heading, #ffffff);
}

.feature-description {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--erp-text-secondary, #4a5568);
  margin: 0;
}

.dark-theme .feature-description {
  color: var(--erp-text-secondary, #cbd5e1);
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .feature-title {
    font-size: 1.125rem;
  }

  .feature-description {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .features-grid {
    gap: 1.25rem;
  }

  .feature-card {
    padding: 1.25rem;
  }

  .feature-icon {
    width: 40px;
    height: 40px;
  }
}
</style>

