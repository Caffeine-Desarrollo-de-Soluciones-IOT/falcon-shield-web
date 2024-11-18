<script>
export default {
  data() {
    return {
      activeIndex: null, // Para gestionar el acordeón
      activeGuideIndex: null,
      pdfSmokeUrl: new URL('@/assets/pdf-files/smoke-detector.pdf', import.meta.url).href,
      pdfProximityUrl: new URL('@/assets/pdf-files/proximity-sensor.pdf', import.meta.url).href
    };
  },
  methods: {
    redirectToContact() {
      this.$router.push("/contact"); // Redirigir a la página de contacto
    }
  }
};
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">{{ $t('assistance.title') }}</div>
    <p class="mb-4">{{ $t('assistance.description') }}</p>

    <!-- FAQ Section -->
    <h3 class="font-semibold text-lg mb-3">{{ $t('assistance.faqs') }}</h3>
    <Accordion v-model="activeIndex">
      <AccordionTab :header="$t('assistance.faq1')">
        <p>{{ $t('assistance.faq1Answer') }}</p>
      </AccordionTab>
      <AccordionTab :header="$t('assistance.faq2')">
        <p>{{ $t('assistance.faq2Answer') }}</p>
      </AccordionTab>
      <AccordionTab :header="$t('assistance.faq3')">
        <p>{{ $t('assistance.faq3Answer') }}</p>
      </AccordionTab>
    </Accordion>

    <!-- Guides and Tutorials Section -->
    <h3 class="font-semibold text-lg mt-5 mb-3">{{ $t('assistance.guidesAndTutorials') }}</h3>
    <Accordion v-model="activeGuideIndex">
      <AccordionTab :header="$t('assistance.guide1.title')">
        <!-- PDF Viewer -->
        <h4 class="font-semibold mt-4 mb-2">{{ $t('assistance.guide1.manual1') }}</h4>
        <div class="pdf-viewer">
          <iframe :src="pdfSmokeUrl" width="100%" height="800px" :title="$t('assistance.title')">
          </iframe>
        </div>
        <h4 class="font-semibold mt-4 mb-2">{{ $t('assistance.guide1.manual2') }}</h4>
        <div class="pdf-viewer">
          <iframe :src="pdfProximityUrl" width="100%" height="800px" :title="$t('assistance.title')">
          </iframe>
        </div>
      </AccordionTab>
      <AccordionTab :header="$t('assistance.guide2.title')">
        <p>{{ $t('assistance.guide2.description') }}</p>
      </AccordionTab>
      <AccordionTab :header="$t('assistance.guide3.title')">
        <p>{{ $t('assistance.guide3.description') }}</p>
      </AccordionTab>
    </Accordion>

    <!-- Support Contact Section -->
    <h3 class="font-semibold text-lg mt-5 mb-3">{{ $t('assistance.support') }}</h3>
    <p>{{ $t('assistance.supportText') }}</p>
    <Button :label="$t('assistance.contactSupport')" icon="pi pi-envelope" class="p-button-outlined" @click="redirectToContact"></Button>
  </div>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}

ul li {
  margin-bottom: 0.5rem;
}

ul li a {
  color: #007ad9;
  text-decoration: none;
}

ul li a:hover {
  text-decoration: underline;
}
</style>
