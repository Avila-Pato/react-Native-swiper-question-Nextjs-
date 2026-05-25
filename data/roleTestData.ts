import { RoleInfo, RoleQuestion } from "@/types/roleTest";

export const ROLES: RoleInfo[] = [
  {
    key: "frontend",
    label: "Frontend / UX",
    emoji: "🎨",
    color: "#F59E0B",
    description: "Construyes interfaces que enamoran. Tu código es lo que los usuarios tocan y sienten. Dominas React, animaciones y experiencia de usuario.",
    stack: "React · TypeScript · Tailwind · Figma · React Native",
  },
  {
    key: "backend",
    label: "Backend",
    emoji: "⚙️",
    color: "#3B82F6",
    description: "Eres el motor invisible. Diseñas APIs, modelas bases de datos y garantizas que el sistema funcione bajo cualquier carga.",
    stack: "Node.js · Python · PostgreSQL · Docker · REST/GraphQL",
  },
  {
    key: "datos",
    label: "Datos / IA",
    emoji: "📊",
    color: "#8B5CF6",
    description: "Ves patrones donde otros ven ruido. Construyes modelos que aprenden, predicen y toman decisiones por sí solos.",
    stack: "Python · Pandas · PyTorch · SQL · Scikit-learn",
  },
  {
    key: "devops",
    label: "DevOps / Cloud",
    emoji: "☁️",
    color: "#34D59A",
    description: "Automatizas todo y garantizas el uptime. Diseñas infraestructuras que escalan para millones de usuarios sin romperse.",
    stack: "Kubernetes · Terraform · AWS · CI/CD · Docker",
  },
  {
    key: "seguridad",
    label: "Ciberseguridad",
    emoji: "🔒",
    color: "#EF4444",
    description: "Piensas como el atacante para proteger el sistema. Encuentras vulnerabilidades antes de que lo hagan los malos.",
    stack: "Kali Linux · Burp Suite · OSCP · SIEM · Pentesting",
  },
];

// 20 questions total: 16 Likert + 4 choice (at positions 5, 10, 15, 20)
export const QUESTIONS: RoleQuestion[] = [
  // Q1–Q4: one per role (Likert)
  { id: 1,  type: "likert", role: "frontend",  text: "Cuando uso una app, lo primero que noto es si la interfaz es intuitiva y atractiva." },
  { id: 2,  type: "likert", role: "backend",   text: "Prefiero resolver lógica compleja del servidor antes que pensar en cómo se ve la pantalla." },
  { id: 3,  type: "likert", role: "datos",     text: "Encuentro patrones interesantes en grandes conjuntos de datos que otros no logran ver." },
  { id: 4,  type: "likert", role: "devops",    text: "Me gusta automatizar tareas repetitivas para que las máquinas hagan el trabajo por mí." },

  // Q5: CHOICE #1
  {
    id: 21, type: "choice",
    text: "¿Cuál de estos proyectos te gustaría crear desde cero?",
    options: [
      { text: "Una landing interactiva con animaciones fluidas",          role: "frontend"  },
      { text: "Una API REST que soporte miles de peticiones por segundo", role: "backend"   },
      { text: "Un modelo que recomienda contenido por comportamiento",    role: "datos"     },
      { text: "Un pipeline que despliega en cloud sin intervención",      role: "devops"    },
    ],
  },

  // Q6–Q9
  { id: 5,  type: "likert", role: "frontend",  text: "Disfruto creando animaciones y transiciones que hacen que una app se sienta premium." },
  { id: 6,  type: "likert", role: "backend",   text: "Me satisface que una API responda rápido y de forma confiable bajo miles de peticiones." },
  { id: 7,  type: "likert", role: "datos",     text: "Me imagino construyendo modelos que predicen comportamientos o clasifican información." },
  { id: 8,  type: "likert", role: "devops",    text: "Pensar cómo escalar un sistema para soportar millones de usuarios me resulta emocionante." },

  // Q10: CHOICE #2
  {
    id: 22, type: "choice",
    text: "Entras a una startup tech. ¿Cuál sería tu primera contribución?",
    options: [
      { text: "Rediseñar el onboarding para que convierta más",            role: "frontend"  },
      { text: "Optimizar las consultas lentas de la base de datos",        role: "backend"   },
      { text: "Analizar métricas para detectar por qué se van usuarios",   role: "datos"     },
      { text: "Securizar la infraestructura antes del primer lanzamiento", role: "seguridad" },
    ],
  },

  // Q11–Q14
  { id: 10, type: "likert", role: "frontend",  text: "Me apasiona que cada detalle visual comunique algo y que el usuario lo sienta así." },
  { id: 11, type: "likert", role: "backend",   text: "Diseñar estructuras de bases de datos eficientes y bien normalizadas me resulta apasionante." },
  { id: 12, type: "likert", role: "datos",     text: "Convertir datos crudos en insights claros que impacten decisiones me parece muy valioso." },
  { id: 9,  type: "likert", role: "seguridad", text: "Entender cómo piensan los atacantes para poder defenderme mejor me parece fascinante." },

  // Q15: CHOICE #3
  {
    id: 23, type: "choice",
    text: "¿Qué tipo de reto técnico te genera más energía?",
    options: [
      { text: "Lograr que una animación compleja se sienta completamente natural",  role: "frontend"  },
      { text: "Diseñar un esquema de BD que aguante millones de registros",         role: "backend"   },
      { text: "Automatizar despliegues en varios entornos cloud distintos",         role: "devops"    },
      { text: "Encontrar una vulnerabilidad crítica antes que los atacantes",       role: "seguridad" },
    ],
  },

  // Q16–Q19
  { id: 16, type: "likert", role: "backend",   text: "La arquitectura interna de un sistema me emociona más que su apariencia visual." },
  { id: 17, type: "likert", role: "datos",     text: "Quiero construir sistemas que aprendan solos y mejoren con cada nueva experiencia." },
  { id: 14, type: "likert", role: "seguridad", text: "Revisar código en busca de vulnerabilidades antes del lanzamiento me parece una tarea crítica." },
  { id: 19, type: "likert", role: "seguridad", text: "La privacidad y protección de los datos de los usuarios es algo que me preocupa profundamente." },

  // Q20: CHOICE #4 (last question)
  {
    id: 24, type: "choice",
    text: "¿Qué herramienta dominarías este año si pudieras elegir?",
    options: [
      { text: "Framer Motion + Figma para interfaces premium",       role: "frontend"  },
      { text: "Kubernetes + Helm para infraestructura cloud",        role: "devops"    },
      { text: "PyTorch para construir modelos de deep learning",     role: "datos"     },
      { text: "Burp Suite para auditorías de seguridad",             role: "seguridad" },
    ],
  },
];
