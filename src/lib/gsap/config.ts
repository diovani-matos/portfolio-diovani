import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

// useGSAP precisa ser registrado para que o cleanup automático
// de contexto funcione corretamente nos componentes
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

ScrollTrigger.defaults({
  markers: false,
  ease: "power3.out",
});

export { gsap, ScrollTrigger, ScrollToPlugin };
