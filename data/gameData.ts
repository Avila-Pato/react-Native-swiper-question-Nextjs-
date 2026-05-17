import { GameData } from "@/types/types";

const W = "?w=800&auto=format&fit=crop";

const gameData: GameData = {
  // ── Nivel 1: primera bifurcación ──────────────────────────────────────────
  inicio_perdido: {
    image: `https://images.unsplash.com/photo-1504384308090-c894fdcc538d${W}`,
    texto:
      "Alguien te pregunta '¿a qué área de tecnología te quieres dedicar?' ¿Cuál de estas dos frases te representa mejor ahora mismo?",
    opciones: [
      {
        texto:
          "Tengo nociones de seguridad informática y quiero estar al tanto de las actualizaciones de la industria.",
        puntos: { cybersec: 1, devops: 1, data: 1 },
        siguienteNodo: "intro_tecnico",
      },
      {
        texto:
          "Me llama la tecnología pero hay mil opciones y no sé cuál es la mía: lenguajes, áreas, roles... estoy perdido.",
        puntos: { software_dev: 1, analitico: 1 },
        siguienteNodo: "rama_tecnologia",
      },
    ],
  },

  // ── Nivel 2 (rama técnica): seguridad vs infraestructura ─────────────────
  intro_tecnico: {
    image: `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5${W}`,
    texto:
      "Claramente eres del lado técnico. El sistema tiene dos puntos críticos. ¿Cuál de estas situaciones te genera más adrenalina?",
    opciones: [
      {
        texto:
          "Ataque activo: hay una intrusión en curso y hay que cerrar la brecha antes de que roben los datos.",
        puntos: { cybersec: 2 },
        siguienteNodo: "rama_ciberseguridad",
      },
      {
        texto:
          "La infraestructura se cayó: millones de registros sin procesar. Hay que levantar pipelines y escalar servidores.",
        puntos: { devops: 1, data: 1 },
        siguienteNodo: "intro_infra",
      },
    ],
  },

  // ── Nivel 3 (rama infra): cloud vs datos ─────────────────────────────────
  intro_infra: {
    image: `https://images.unsplash.com/photo-1558494949-ef010cbdcc31${W}`,
    texto:
      "El equipo de infraestructura te necesita en uno de dos frentes críticos. ¿Cuál es tu dominio?",
    opciones: [
      {
        texto:
          "Cloud & Operaciones: diseño la arquitectura multi-cloud y garantizo el 99.99% de uptime del sistema.",
        puntos: { devops: 2, arquitectura: 1 },
        siguienteNodo: "rama_devops",
      },
      {
        texto:
          "Datos e IA: construyo los pipelines que alimentan los modelos de Machine Learning de la empresa.",
        puntos: { data: 2, matematico: 1 },
        siguienteNodo: "rama_data_ai",
      },
    ],
  },

  // ── Rama Ciberseguridad ───────────────────────────────────────────────────
  rama_ciberseguridad: {
    image: `https://images.unsplash.com/photo-1550751827-4bd374c3f58b${W}`,
    texto:
      "Lograste contener el ataque. Ahora el equipo te pide definir tu estrategia a largo plazo. ¿Cómo prefieres operar?",
    opciones: [
      {
        texto:
          "Red Team — Hacking Ético: atacar nuestros propios sistemas y encontrar vulnerabilidades antes que los criminales.",
        puntos: { pentesting: 3, analitico: 2 },
        siguienteNodo: "perfil_pentester",
      },
      {
        texto:
          "Blue Team — Defensa Operativa: diseñar las murallas, monitorear en tiempo real y responder a incidentes.",
        puntos: { defensa_seguridad: 3, analitico: 1 },
        siguienteNodo: "perfil_soc_analyst",
      },
    ],
  },

  // ── Rama DevOps / Cloud ───────────────────────────────────────────────────
  rama_devops: {
    image: `https://images.unsplash.com/photo-1451187580459-43490279c0fa${W}`,
    texto:
      "Salvaste la infraestructura. El CTO queda impresionado y te pide que definas tu especialización. ¿Cuál es tu frente?",
    opciones: [
      {
        texto:
          "Cloud Architect: defino la estrategia multi-cloud, optimizo costos y garantizo escalabilidad ilimitada.",
        puntos: { cloud: 3, arquitectura: 2 },
        siguienteNodo: "perfil_cloud_architect",
      },
      {
        texto:
          "Site Reliability Engineer: automatizo cada despliegue con CI/CD, gestiono Kubernetes y aseguro el 99.99% de uptime.",
        puntos: { sre: 3, automatizacion: 2 },
        siguienteNodo: "perfil_sre",
      },
    ],
  },

  // ── Rama Data / AI ────────────────────────────────────────────────────────
  rama_data_ai: {
    image: `https://images.unsplash.com/photo-1620712943543-bcc4688e7485${W}`,
    texto:
      "Entras al laboratorio de datos. Hay dos propuestas críticas sobre la mesa. ¿Cuál eliges?",
    opciones: [
      {
        texto:
          "Modelo de ML: creo una red neuronal para automatizar la toma de decisiones del sistema en tiempo real.",
        puntos: { ai_engineer: 3, matematico: 2 },
        siguienteNodo: "perfil_ai_engineer",
      },
      {
        texto:
          "Pipelines de Big Data: estructuro el flujo de limpieza, almacenamiento y procesamiento de millones de registros.",
        puntos: { data_engineer: 3, arquitectura: 1 },
        siguienteNodo: "perfil_data_engineer",
      },
    ],
  },

  // ── Rama Tecnología (para quien no sabe qué lenguaje elegir) ─────────────
  rama_tecnologia: {
    image: `https://images.unsplash.com/photo-1461749280684-dccba630e2f6${W}`,
    texto:
      "Hay infinitas rutas en tecnología. Para encontrar la tuya, dime: ¿qué resultado te emociona más imaginar que tú lo construiste?",
    opciones: [
      {
        texto:
          "Una app o sitio web que miles de personas usan y les encanta la experiencia.",
        puntos: { frontend: 1, software_dev: 2 },
        siguienteNodo: "rama_web_mobile",
      },
      {
        texto:
          "Un sistema que resuelve problemas difíciles: datos, algoritmos, automatización o rendimiento puro.",
        puntos: { data: 1, sistemas: 1, analitico: 2 },
        siguienteNodo: "rama_logica",
      },
    ],
  },

  // ── Rama Web / Mobile ─────────────────────────────────────────────────────
  rama_web_mobile: {
    image: `https://images.unsplash.com/photo-1547658719-da2b51169166${W}`,
    texto:
      "Quieres construir cosas que la gente usa. ¿Qué te atrae más de ese trabajo?",
    opciones: [
      {
        texto:
          "Lo visual: que la interfaz sea hermosa, fluida y que el usuario la ame desde el primer toque.",
        puntos: { frontend: 3, ux: 2 },
        siguienteNodo: "perfil_frontend_dev",
      },
      {
        texto:
          "La lógica invisible: que la API responda en milisegundos, los datos seguros y bien estructurados.",
        puntos: { backend: 3, arquitectura: 1 },
        siguienteNodo: "perfil_backend_dev",
      },
    ],
  },

  // ── Rama Lógica / Sistemas ────────────────────────────────────────────────
  rama_logica: {
    image: `https://images.unsplash.com/photo-1635070041078-e363dbe005cb${W}`,
    texto:
      "Quieres atacar problemas complejos. ¿Con cuál de estas dos mentalidades te identificas?",
    opciones: [
      {
        texto:
          "Analítico / Matemático: me atraen los patrones, la estadística y convertir datos en decisiones.",
        puntos: { data: 3, matematico: 2 },
        siguienteNodo: "perfil_python_data",
      },
      {
        texto:
          "Ingeniero de sistemas: quiero control del hardware, rendimiento máximo, código a la velocidad del metal.",
        puntos: { sistemas: 3, analitico: 1 },
        siguienteNodo: "perfil_sistemas_dev",
      },
    ],
  },

  // ── Perfiles finales (opciones: []) ──────────────────────────────────────
  perfil_pentester: {
    image: `https://images.unsplash.com/photo-1563206767-5b18f218e8de${W}`,
    texto:
      "🔴 PENTESTER — Red Team Hacker\n\nEncontraste tu camino en las sombras del sistema. Eres el adversario que trabaja para el lado correcto.\n\nTu misión es entrar antes de que lo hagan los malos: explotas vulnerabilidades en aplicaciones web, redes y sistemas operativos usando las mismas herramientas que un atacante real, pero con autorización explícita.\n\nTu stack: Kali Linux, Metasploit, Burp Suite, OSCP, técnicas de ingeniería social, fuzzing y análisis de binarios.\n\nSi disfrutas el juego del gato y el ratón, los CTFs a las 3am y pensar como un criminal para proteger inocentes, este es tu rol.",
    opciones: [],
  },

  perfil_soc_analyst: {
    image: `https://images.unsplash.com/photo-1551808525-51a94da548ce${W}`,
    texto:
      "🔵 SOC ANALYST — Blue Team / Defensa Operativa\n\nMientras otros atacan, tú construyes las murallas y las vigilas 24/7.\n\nOperas desde el Centro de Operaciones de Seguridad: monitorizas logs en tiempo real con SIEMs como Splunk o Microsoft Sentinel, detectas anomalías y realizas análisis forense digital cuando el daño ya ocurrió.\n\nTu stack: SIEM, IDS/IPS, threat hunting, análisis de malware, frameworks MITRE ATT&CK, CrowdStrike, Wireshark.\n\nTu trabajo es silencioso pero imprescindible: cada alerta que investigas puede ser la diferencia entre una brecha contenida y una catástrofe corporativa.",
    opciones: [],
  },

  perfil_ai_engineer: {
    image: `https://images.unsplash.com/photo-1677442135703-1787eea5ce01${W}`,
    texto:
      "🤖 AI/ML ENGINEER — Ingeniero de Inteligencia Artificial\n\nDescubriste que tu mente piensa en modelos, funciones de pérdida y distribuciones de probabilidad.\n\nDiseñas, entrenas y despliegas modelos de Machine Learning y Deep Learning: sistemas de recomendación, detección de fraude, visión por computadora y procesamiento de lenguaje natural.\n\nTu stack: Python, TensorFlow, PyTorch, Scikit-learn, Hugging Face, MLflow y plataformas cloud de ML como SageMaker o Vertex AI.\n\nSi te apasiona convertir matemáticas en sistemas que aprenden solos, encontraste tu lugar.",
    opciones: [],
  },

  perfil_data_engineer: {
    image: `https://images.unsplash.com/photo-1551288049-bebda4e38f71${W}`,
    texto:
      "🏗️ DATA ENGINEER — Arquitecto de Datos\n\nAntes de que exista cualquier insight, dashboard o modelo de IA, tú construiste la infraestructura que lo hace posible.\n\nEres el fontanero de los datos: diseñas y mantienes pipelines ETL/ELT que mueven, transforman y almacenan petabytes de información de forma confiable y eficiente.\n\nTu stack: Apache Spark, Kafka, Airflow, dbt, Snowflake, BigQuery, Redshift y Delta Lake.\n\nConstruyes los rieles del tren antes de que nadie suba a bordo.",
    opciones: [],
  },

  perfil_cloud_architect: {
    image: `https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9${W}`,
    texto:
      "☁️ CLOUD ARCHITECT — Arquitecto de Soluciones Cloud\n\nPiensas en infraestructura como otros piensan en código: con elegancia, escalabilidad y visión de largo plazo.\n\nDiseñas la columna vertebral tecnológica de las organizaciones: decides qué servicios usar en AWS, GCP o Azure, cómo distribuir cargas y cómo optimizar costos sin sacrificar rendimiento.\n\nTu stack: AWS, GCP, Azure, Terraform, Pulumi, arquitecturas serverless, microservicios y estrategias de disaster recovery.\n\nSi te gusta el big picture y ver tu diseño soportar picos de tráfico brutales sin caerse, este es tu destino.",
    opciones: [],
  },

  perfil_sre: {
    image: `https://images.unsplash.com/photo-1484557052118-f32bd25b45b5${W}`,
    texto:
      "⚙️ SITE RELIABILITY ENGINEER (SRE)\n\nEres el guardián del uptime. Tu trabajo no termina cuando el código se despliega; empieza ahí.\n\nGarantizas que los sistemas sean confiables, escalables y eficientes a través de la automatización. Defines SLOs/SLAs, gestionas alertas inteligentes y eres el primero en responder cuando algo explota en producción a las 3am.\n\nTu stack: Kubernetes, Helm, CI/CD, Prometheus, Grafana, Terraform, Ansible y Docker.\n\nSi te apasiona la automatización y la idea de que el software debe ser tan confiable como la electricidad, este es tu rol.",
    opciones: [],
  },

  perfil_frontend_dev: {
    image: `https://images.unsplash.com/photo-1618477388954-7852f32655ec${W}`,
    texto:
      "🎨 FRONTEND DEVELOPER — Arquitecto de Experiencias\n\nTu código es lo que los usuarios tocan, ven y sienten. Eres el artista y el ingeniero al mismo tiempo.\n\nConstruyes interfaces que enamoran: desde landing pages hasta apps web complejas y aplicaciones móviles. Tu obsesión son los detalles que hacen que algo se sienta premium: animaciones fluidas, carga instantánea, diseño que respira.\n\nTu stack para empezar: JavaScript → TypeScript → React → React Native. CSS y Tailwind para los estilos. Figma para entender el diseño.\n\nSi cuando usas una app piensas 'yo lo haría diferente' y sientes el impulso de construirlo tú mismo, este es tu camino.",
    opciones: [],
  },

  perfil_backend_dev: {
    image: `https://images.unsplash.com/photo-1627398242454-45a1465c2479${W}`,
    texto:
      "⚙️ BACKEND DEVELOPER — El Motor Invisible\n\nEl usuario nunca te ve, pero sin ti nada funciona. Eres el arquitecto de la lógica que mueve el mundo digital.\n\nDiseñas APIs que consumen millones de apps, modelas bases de datos que guardan información crítica y garantizas que el sistema sea seguro y confiable bajo cualquier carga.\n\nTu stack para empezar: Python (FastAPI / Django) o Node.js → SQL (PostgreSQL) → REST APIs → Docker.\n\nSi te satisface resolver un problema complejo de lógica y que todo encaje perfectamente aunque nadie lo vea, encontraste tu lugar.",
    opciones: [],
  },

  perfil_python_data: {
    image: `https://images.unsplash.com/photo-1516116216624-53e697fedbea${W}`,
    texto:
      "🐍 DATA SCIENTIST — El Intérprete de los Datos\n\nVes patrones donde otros ven ruido. Tu superpoder es convertir millones de datos en decisiones concretas.\n\nUsas Python como navaja suiza: análisis exploratorio, visualización, modelos estadísticos y los primeros pasos en Machine Learning. Los datos cuentan historias; tú eres quien las traduce.\n\nTu stack para empezar: Python → Pandas → NumPy → Matplotlib → Scikit-learn → Jupyter Notebooks. SQL para extraer los datos.\n\nSi una gráfica bien hecha te genera satisfacción y siempre preguntas '¿por qué ocurrió esto?' antes del '¿qué ocurrió?', eres un Data Scientist en potencia.",
    opciones: [],
  },

  perfil_sistemas_dev: {
    image: `https://images.unsplash.com/photo-1518770660439-4636190af475${W}`,
    texto:
      "⚡ SYSTEMS DEVELOPER — El Domador del Hardware\n\nMientras otros programan sobre frameworks, tú controlas los recursos directamente: memoria, hilos, ciclos de CPU.\n\nEscrives código que corre a la velocidad del metal: sistemas operativos, motores de videojuegos, compiladores, herramientas de red o software embebido donde cada microsegundo importa.\n\nTu stack para empezar: C → C++ o Rust → gestión manual de memoria → concurrencia → profilers de rendimiento.\n\nSi te intriga saber qué hay debajo de la abstracción y el control total del hardware te genera satisfacción, elegiste el camino más exigente y más respetado de la industria.",
    opciones: [],
  },
};

export default gameData;
