import { CulturalRecord, ArtisanProfile, CulturalExperience, QnAResponse } from '../types';

import heroCraftsImg from '../assets/images/hero_nigerian_crafts_1791632798829.jpg';
import potteryStudioImg from '../assets/images/artisan_pottery_studio_1791632811278.jpg';
import asoOkeCraftImg from '../assets/images/craft_asooke_weaving_1791632821815.jpg';
import beadmakingImg from '../assets/images/craft_beadmaking_ileke_1791632834337.jpg';
import adireIndigoImg from '../assets/images/craft_adire_indigo_1791632845279.jpg';

export const CULTURAL_RECORDS: CulturalRecord[] = [
  {
    id: 'rec_aso_oke_01',
    slug: 'aso-oke-weaving',
    title: 'Aso-Òkè: The Woven Prestige of Yoruba Heritage',
    nativeName: 'Aṣọ-Òkè (Aṣọ Òkè)',
    language: 'Yorùbá',
    category: 'Textiles',
    region: 'Southwest Nigeria (Oyo, Osun, Ondo, Lagos)',
    community: 'Yoruba artisan weaving guilds',
    shortDescription: 'Narrow-band cloth handwoven on traditional horizontal and vertical looms, representing dignity, lineage, and ceremony.',
    fullNarrative: [
      'Aso-Òkè translates literally to "top cloth" or "cloth of high status". Originating in ancient weaving centers across Yorubaland—notably Iseyin, Oyo, and Ede—it has for centuries defined significant rites of passage, including weddings, chieftaincy coronations, and ancestral festivals.',
      'Woven in narrow strips approximately 10 to 15 centimeters wide, each length is meticulously stitched edge-to-edge to form complete ceremonial wrappers (iro), head-ties (gele), and grand robes (agbada). The loom apparatus itself requires synchronized foot pedals (itẹ) and hand shuttles (ọkọ) operating in steady rhythmic coordination.',
      'Traditional Aso-Òkè exists in three canonical classical varieties: Sanyan (handspun wild silk dyed to a pale khaki-brown), Alaari (scarlet silk or wool historically traded across trans-Saharan routes), and Etu (deep natural indigo-dyed cotton with crisp white pinstripes). In contemporary Lagos workshops, master weavers innovate by integrating metallic lurex and open-work eyelets (ona abere) while safeguarding the original structural discipline.'
    ],
    historicalContext: 'Historical accounts document narrow-loom weaving in the Yoruba interior from at least the 15th century, with guild systems protecting dyeing formulas and loom carpentry techniques across successive generations.',
    materialAndTechnique: 'Organic handspun cotton, wild anaphe silk, horizontal narrow-strip treadle loom, natural indigo vat fermentation, and bone shuttle beating.',
    status: 'documented',
    statusReason: 'Reviewed against field documentation from the Centre for Black and African Arts and Civilization (CBAAC) and oral accounts from the Iseyin Weavers Guild.',
    sensitivity: 'public',
    sources: [
      {
        id: 'src_aso_01',
        citation: 'Eicher, Joanne B. "Nigerian Handcrafted Textiles". University of Ife Press.',
        year: 1976,
        type: 'academic_archive',
        institutionOrContributor: 'University of Ife Archives'
      },
      {
        id: 'src_aso_02',
        citation: 'Iseyin Master Weavers Guild Oral Testimonies recorded by CBAAC fieldwork cohort.',
        year: 2018,
        type: 'oral_history',
        institutionOrContributor: 'CBAAC Documentation Registry'
      }
    ],
    relatedCraftSlugs: ['adire-eleko-indigo', 'ileke-beadwork'],
    relatedArtisanIds: ['art_babatunde_adeyemi'],
    imageUrl: asoOkeCraftImg,
    imageCaption: 'Intricate Aso-Oke band woven on a narrow treadle loom with indigo and metallic gold warp threading.',
    lastReviewedDate: '2026-03-14'
  },
  {
    id: 'rec_adire_02',
    slug: 'adire-eleko-indigo',
    title: 'Àdìrẹ Ẹlẹ́kọ: Cassava Stencil Indigo Resist',
    nativeName: 'Àdìrẹ Ẹlẹ́kọ (Adire)',
    language: 'Yorùbá',
    category: 'Textiles',
    region: 'Ogun State & Lagos Mainland',
    community: 'Egba and Lagos indigo dyers',
    shortDescription: 'Hand-painted and stenciled resist-dyed textile utilizing fermented cassava paste and subterranean natural indigo vats.',
    fullNarrative: [
      'Àdìrẹ is the indigo-dyed cloth of southwestern Nigeria, with the Ẹlẹ́kọ variant representing its highest decorative precision. Unlike tied resist (Àdìrẹ Oniko), Ẹlẹ́kọ relies on a smooth paste prepared from fermented cassava flour (ẹlẹ́kọ) applied through hand-cut zinc stencils or painted freehand with bird feathers.',
      'Once the cassava paste cures under the sun, the fabric is immersed multiple times in deep earthenware vats containing fermented indigo leaves (elu) combined with wood ash lye. The paste blocks the dye from penetrating, creating stark alabaster motifs against deep midnight blues.',
      'Each traditional pattern carries precise social and proverbs-laden meaning. Motifs such as Olokun (goddess of the sea), Sunbebe (small beads of grace), and Ibadandun (Ibadan is sweet) encode cultural proverbs and historical commemorations within their geometric grids.'
    ],
    historicalContext: 'Centred historically in Abeokuta since the mid-19th century, Adire production provided economic independence for female artisan dynasties (Iya Alaro) throughout colonial and post-colonial periods.',
    materialAndTechnique: '100% cotton broadcloth, fermented cassava root starch, natural Lonchocarpus cyanescens (elu) indigo leaves, wood ash alkaline mordant, zinc hand-cut stencils.',
    status: 'documented',
    statusReason: 'Documented with the support of Abeokuta community dyers and historical textile archives.',
    sensitivity: 'public',
    sources: [
      {
        id: 'src_adire_01',
        citation: 'Wolff, Norma H. "Traditional and Contemporary Art of the Yoruba". African Studies Association.',
        year: 1982,
        type: 'academic_archive'
      },
      {
        id: 'src_adire_02',
        citation: 'Itoku Dyers Association, Abeokuta oral narrative archive.',
        year: 2021,
        type: 'community_elder'
      }
    ],
    relatedCraftSlugs: ['aso-oke-weaving'],
    relatedArtisanIds: ['art_bisi_folorunsho'],
    imageUrl: adireIndigoImg,
    imageCaption: 'Adire resist textiles hanging to aerate and oxidize in a courtyard dye compound.',
    lastReviewedDate: '2026-04-02'
  },
  {
    id: 'rec_ileke_03',
    slug: 'ileke-beadwork',
    title: 'Ìlẹ̀kẹ̀: Sacred and Royal Yoruba Beadwork',
    nativeName: 'Ìlẹ̀kẹ̀ Ọba àti Ìlẹ̀kẹ̀ Ẹ̀yẹ',
    language: 'Yorùbá',
    category: 'Beadwork',
    region: 'Southwest Nigeria & Lagos Lagoon',
    community: 'Yoruba royal beadmakers and trade guilds',
    shortDescription: 'Regal beaded crowns, footwear, scepters, and waist adornments carrying spiritual authority and lineages.',
    fullNarrative: [
      'In Yoruba cosmology and courtly governance, beads (Ìlẹ̀kẹ̀) are not mere ornament; they are conduits of ashẹ (spiritual life-force) and markers of divine sanction. Beaded crowns with beaded veils (Adé Nlá) protect onlookers from the intense spiritual gaze of the monarch while preserving the ancestral office.',
      'Bead stringers historically formed exclusive hereditary guilds attached to royal palaces in Ile-Ife, Oyo, and Benin. Tiny imported chevron trade beads, indigenous terracotta beads, and carved jasper were threaded with strong vegetable fibers.',
      'Beyond royalty, beadwork marks key human passages: waist beads (Ìlẹ̀kẹ̀ ìbàdí) for fertility, protection, and body alignment, as well as sacerdotal beads for initiates of Orisha lineages (such as the striped blue-and-white of Yemoja or deep terracotta coral of Ogun).'
    ],
    historicalContext: 'Glass bead manufacture in Ile-Ife dates back to the 11th to 14th centuries CE at the Olokun Grove site, proving indigenous high-temperature glass melting technology preceding European contact.',
    materialAndTechnique: 'Dichroic glass, vintage trade beads, natural red Mediterranean coral (Iyun), hand-twisted sinew and braided cotton thread, hollow core brass spacer rings.',
    status: 'documented',
    statusReason: 'Supported by archaeological excavations at Ile-Ife and interviews with guild artisans.',
    sensitivity: 'public',
    sources: [
      {
        id: 'src_ileke_01',
        citation: 'Drewal, Henry John. "Beads, Body, and Soul: Art and Light in the Yoruba Universe". UCLA Fowler Museum.',
        year: 1998,
        type: 'museum_catalogue'
      },
      {
        id: 'src_ileke_02',
        citation: 'Lagos Island Traditional Beaders Council oral records.',
        year: 2024,
        type: 'oral_history'
      }
    ],
    relatedCraftSlugs: ['aso-oke-weaving'],
    relatedArtisanIds: ['art_kemi_balogun'],
    imageUrl: beadmakingImg,
    imageCaption: 'Handcrafted coral trade beads and ancient glass beads arrayed on carved wooden tray.',
    lastReviewedDate: '2026-02-18'
  },
  {
    id: 'rec_terracotta_04',
    slug: 'traditional-terracotta-pottery',
    title: 'Earthen Vessels: The Living Clay of Nigerian Terracotta',
    nativeName: 'Àkòkò àti Ìkòkò Amọ̀',
    language: 'Yorùbá / Nok Traditions',
    category: 'Pottery & Ceramics',
    region: 'Lagos State, Ogun, and Plateau Heritage',
    community: 'Women potters guilds and contemporary ceramic studios',
    shortDescription: 'Coil-built and wheel-thrown earthenware shaped from local alluvial clays and pit-fired with organic botanical glazes.',
    fullNarrative: [
      'Nigeria boasts the oldest known terracotta sculpture tradition in Sub-Saharan Africa, stretching back over two millennia to the Nok Culture of the Jos Plateau. In contemporary southwestern Nigeria, utilitarian and ceremonial pots (ìkòkò) continue to be shaped with ancestral reverence for the earth.',
      'Traditional potters source damp alluvial clay from riverbanks, weathering and kneading it with grog (crushed fired sherds) to prevent thermal shock. Large water vessels (ìkòkò omi) are formed without a mechanical wheel through gradual coil building and rhythmic paddle-and-anvil compression.',
      'Once dried in shaded compounds, the vessels undergo open-pit bonfires fueled by dry palm fronds and savannah grasses. While still glowing red, they are doused with decoctions of locust bean pods (iru) or mahogany bark, creating waterproof, lustrous mahogany surfaces.'
    ],
    historicalContext: 'Pottery traditions have historically been passed down maternally, connecting spiritual veneration of river deities with practical domestic science and food preservation.',
    materialAndTechnique: 'Riverbed ball clay, grog temper, hand coiling, wood paddle compression, open clamp bonfires, organic locust bean tannins.',
    status: 'community_reviewed',
    statusReason: 'Reviewed by contemporary ceramic educators and traditional potter elders in Lagos and Ogun states.',
    sensitivity: 'public',
    sources: [
      {
        id: 'src_pot_01',
        citation: 'Leith-Ross, Sylvia. "Nigerian Pottery: A Catalogue". Ibadan University Press.',
        year: 1970,
        type: 'museum_catalogue'
      }
    ],
    relatedCraftSlugs: ['adire-eleko-indigo'],
    relatedArtisanIds: ['art_omowunmi_bello'],
    imageUrl: potteryStudioImg,
    imageCaption: 'Master ceramicist refining an earthenware water pot on a revolving wheel.',
    lastReviewedDate: '2026-05-10'
  },
  {
    id: 'rec_bronze_05',
    slug: 'benin-bronze-lost-wax',
    title: 'Igun Eronmwon: Benin Guild Bronze Casting & Lost-Wax Heritage',
    nativeName: 'Igun Eronmwon (Guild of Brass Casters)',
    language: 'Ẹdo',
    category: 'Metalcraft & Bronze',
    region: 'Edo State & diaspora guild practitioners in Lagos',
    community: 'Igun Street Guild, Benin Kingdom',
    shortDescription: 'Cire perdue (lost-wax) metallurgy preserving royal commemoration, commemorative heads, and high-relief court plaques.',
    fullNarrative: [
      'The Igun Eronmwon guild of Benin City represents one of humanity’s most sophisticated metallurgical dynasties. Working exclusively by royal charter for the Oba of Benin, guild casters utilized the cire perdue method to document history, ritual, and court diplomatic relationships.',
      'The process begins with a clay core over which the artisan sculpts bees’ wax to microscopic relief. Layers of fine sediment slip and coarse clay are molded over the wax. When baked, the wax melts out, leaving a hollow negative space into which molten brass or bronze is poured at temperatures exceeding 1000°C.',
      'Unlike European decorative statuary, Benin commemorative heads (Uhunmwun Elao) and commemorative relief plaques were historical records—a visual archive that preserved the exact lineage, military campaigns, and legal decisions of the kingdom.'
    ],
    historicalContext: 'Rooted in the 13th-century reign of Oba Oguola, the guild is protected under royal hereditary custodianship along Igun Street, a designated UNESCO cultural heritage zone.',
    materialAndTechnique: 'Beeswax, river clay core, crucible furnace casting, copper-zinc-tin alloy, lost-wax investment casting, cold chisel chasing.',
    status: 'documented',
    statusReason: 'Corroborated by the Royal Palace of Benin historical records and academic metallurgical analyses.',
    sensitivity: 'public',
    sources: [
      {
        id: 'src_brz_01',
        citation: 'Eyo, Ekpo, and Frank Willett. "Treasures of Ancient Nigeria". Knopf / Detroit Institute of Arts.',
        year: 1980,
        type: 'museum_catalogue'
      },
      {
        id: 'src_brz_02',
        citation: 'Oral histories of the Enogie of Igun Street, Benin City.',
        year: 2019,
        type: 'community_elder'
      }
    ],
    relatedCraftSlugs: ['ileke-beadwork'],
    relatedArtisanIds: ['art_chidiebere_okafor'],
    imageUrl: heroCraftsImg,
    imageCaption: 'Guild artisan hand-finishing cast alloy metalwork with traditional chisels.',
    lastReviewedDate: '2026-01-22'
  },
  {
    id: 'rec_uli_06',
    slug: 'uli-mural-and-body-art',
    title: 'Uli: Ephemeral Sacred Geometry and Body Calligraphy',
    nativeName: 'Ụlị (Uri)',
    language: 'Igbo',
    category: 'Oral Heritage',
    region: 'Southeastern Nigeria (Anambra, Enugu, Imo)',
    community: 'Igbo women muralists and sacred painters',
    shortDescription: 'Traditional graphic design and body painting derived from organic berry extracts, marked by spontaneous asymmetry and fluid negative space.',
    fullNarrative: [
      'Ụlị is an indigenous art tradition practiced predominantly by Igbo women, encompassing both body ornamentation and wall murals for sacred shrines and domestic compounds.',
      'The paint is extracted from the pods of several forest plants (notably Rothmannia whitfieldii). When expressed onto the skin using a fine wooden stylus (nkasi ana), the clear juice oxidizes to a rich dark indigo-black that endures for several weeks before naturally fading.',
      'Ụlị design philosophy values spontaneity, asymmetry, and bold visual pauses (negative space). Each motif is an abstraction of nature, animals, tools, or philosophical concepts—such as the spiral snake (Agwo), crescent moon (Onwa), or comb (Mfe).'
    ],
    historicalContext: 'While largely suppressed during colonial missionization, Uli was championed in the 1970s by the Nsukka School of artists (including Uche Okeke and Obiora Udechukwu), sparking an intellectual renaissance of African visual language.',
    materialAndTechnique: 'Rothmannia berry extract, crushed chalk (nzu), yellow earth (edo), wooden drawing styluses, freehand organic brushwork.',
    status: 'under_review',
    statusReason: 'Community records on regional symbolic variations are currently under peer review with cultural elders in Enugu and Anambra.',
    sensitivity: 'public',
    sources: [
      {
        id: 'src_uli_01',
        citation: 'Willis, Liz. "Uli Painting and the Igbo World". African Arts, Vol. 23.',
        year: 1989,
        type: 'academic_archive'
      }
    ],
    relatedCraftSlugs: ['adire-eleko-indigo'],
    relatedArtisanIds: [],
    imageUrl: adireIndigoImg,
    imageCaption: 'Traditional graphic motifs rendered with organic botanical resist dyes.',
    lastReviewedDate: '2026-06-05'
  }
];

export const ARTISANS: ArtisanProfile[] = [
  {
    id: 'art_babatunde_adeyemi',
    slug: 'babatunde-adeyemi',
    displayName: 'Babatunde Adeyemi',
    nativeTitle: 'Ọ̀gá Aṣọ-Òkè',
    craft: 'Master Narrow-Loom Weaver',
    craftCategories: ['Textiles', 'Weaving', 'Aso-Oke'],
    bio: 'Fourth-generation master weaver preserving the classical Etu and Sanyan weaving lineages with hand-built horizontal treadle looms in Lagos.',
    story: 'Born to a family of weavers originally from the historic weaving town of Iseyin, Babatunde learned the cadence of the loom at age eight beside his grandfather. In his studio on Lagos Island, he combines rare organic wild silk with naturally dyed cotton, ensuring that ceremonial textiles retain their heirloom density and tactile elegance.',
    publicLocation: 'Lagos Island, Lagos',
    workshopArea: 'Lagos Island Cultural Arts Quarter',
    experienceYears: 28,
    verificationStatus: 'verified',
    publicationStatus: 'published',
    avatarUrl: heroCraftsImg,
    studioImages: [heroCraftsImg, asoOkeCraftImg],
    associatedRecordSlugs: ['aso-oke-weaving'],
    experienceIds: ['exp_asooke_workshop'],
    quote: 'The loom is not merely a machine; it is a conversation between your hands, your feet, and the memory of the elders.',
    contactOptions: {
      inquiryEnabled: true,
      whatsappInquiry: true,
      callPermitted: false,
      displayEmail: 'studio.adeyemi@culturelens-demo.ng'
    }
  },
  {
    id: 'art_bisi_folorunsho',
    slug: 'bisi-folorunsho',
    displayName: 'Alhaja Bisi Folorunsho',
    nativeTitle: 'Ìyá Àláró',
    craft: 'Senior Adire Indigo Master & Stencilist',
    craftCategories: ['Textiles', 'Indigo Dyeing', 'Adire'],
    bio: 'Renowned textile custodian specializing in cold-fermented underground indigo dye vats and freehand cassava-paste stenciling.',
    story: 'Alhaja Bisi traces her lineage through the renowned Itoku dyeing compounds of Abeokuta. Operating between Abeokuta and her studio on the Lagos Mainland, she continues to maintain four generational underground earthen dye vats fed with natural wood ash lye and indigenous Elu leaves.',
    publicLocation: 'Yaba / Mainland, Lagos',
    workshopArea: 'Mainland Heritage Dye Courtyard',
    experienceYears: 34,
    verificationStatus: 'verified',
    publicationStatus: 'published',
    avatarUrl: adireIndigoImg,
    studioImages: [adireIndigoImg, asoOkeCraftImg],
    associatedRecordSlugs: ['adire-eleko-indigo'],
    experienceIds: ['exp_adire_masterclass'],
    quote: 'When you plunge your arms into the blue vat, the dye claims your patience before it blesses the cloth.',
    contactOptions: {
      inquiryEnabled: true,
      whatsappInquiry: true,
      callPermitted: true,
      displayEmail: 'alaro.folorunsho@culturelens-demo.ng'
    }
  },
  {
    id: 'art_kemi_balogun',
    slug: 'kemi-balogun',
    displayName: 'Kemi Balogun',
    nativeTitle: 'Adé Ìlẹ̀kẹ̀ Custodian',
    craft: 'Royal Beadmaker & Adornment Historian',
    craftCategories: ['Beadwork', 'Royal Adornment', 'Jewelry'],
    bio: 'Artisan researcher and stringer creating ceremonial beaded pieces and modern heirlooms rooted in Yoruba royal color symbology.',
    story: 'Kemi trained under royal bead stringers in Oyo and Ile-Ife before founding her exploratory studio in Lagos. Her practice explores the spiritual significance of coral grades, glass chevron trade beads, and antique brass spacers, hosting masterclasses for young Nigerians rediscovering ancestral adornment.',
    publicLocation: 'Victoria Island / Lekki, Lagos',
    workshopArea: 'Lekki Coastal Artisan Hub',
    experienceYears: 16,
    verificationStatus: 'verified',
    publicationStatus: 'published',
    avatarUrl: beadmakingImg,
    studioImages: [beadmakingImg, heroCraftsImg],
    associatedRecordSlugs: ['ileke-beadwork'],
    experienceIds: ['exp_ileke_stringing'],
    quote: 'Each bead carries weight—not just in grams, but in ancestral stories of prestige, protection, and identity.',
    contactOptions: {
      inquiryEnabled: true,
      whatsappInquiry: true,
      callPermitted: false,
      displayEmail: 'kemi.beadworks@culturelens-demo.ng'
    }
  },
  {
    id: 'art_omowunmi_bello',
    slug: 'omowunmi-bello',
    displayName: 'Omowunmi Bello',
    nativeTitle: 'Amọ̀ Artisan',
    craft: 'Traditional Terracotta Sculptor & Ceramicist',
    craftCategories: ['Pottery & Ceramics', 'Terracotta', 'Sculpture'],
    bio: 'Pioneering ceramicist uniting ancient coil-building methodologies with contemporary studio pottery and organic wood-ash glazes.',
    story: 'Omowunmi began learning pottery in the river communities of Ogun state, mastering pit-firing and natural locust bean water-proofing techniques. Her Lagos workshop conducts immersive masterclasses where travelers and collectors shape tactile earthenware with local river clays.',
    publicLocation: 'Surulere, Lagos',
    workshopArea: 'Surulere Arts Workshop',
    experienceYears: 19,
    verificationStatus: 'verified',
    publicationStatus: 'published',
    avatarUrl: potteryStudioImg,
    studioImages: [potteryStudioImg, beadmakingImg],
    associatedRecordSlugs: ['traditional-terracotta-pottery'],
    experienceIds: ['exp_terracotta_wheel'],
    quote: 'The earth has a memory. When your fingers meet wet clay, you are participating in a craft older than any written word.',
    contactOptions: {
      inquiryEnabled: true,
      whatsappInquiry: true,
      callPermitted: true,
      displayEmail: 'omowunmi.ceramics@culturelens-demo.ng'
    }
  },
  {
    id: 'art_chidiebere_okafor',
    slug: 'chidiebere-okafor',
    displayName: 'Chidiebere Okafor',
    nativeTitle: 'Oka-Igwe & Foundry Master',
    craft: 'Lost-Wax Metallurgy & Traditional Metalcraft',
    craftCategories: ['Metalcraft & Bronze', 'Foundry', 'Sculpture'],
    bio: 'Artisan metalworker practicing lost-wax investment casting and bronze sculptural restoration in Lagos.',
    story: 'Chidiebere spent a decade apprenticing in traditional foundry guilds before establishing his studio in Lagos. He creates authentic bronze and brass works using traditional wax modeling and investment plaster, actively lecturing on the metallurgy of ancient West Africa.',
    publicLocation: 'Ikeja / Maryland, Lagos',
    workshopArea: 'Maryland Foundry Studio',
    experienceYears: 15,
    verificationStatus: 'community_acknowledged',
    publicationStatus: 'published',
    avatarUrl: heroCraftsImg,
    studioImages: [heroCraftsImg, potteryStudioImg],
    associatedRecordSlugs: ['benin-bronze-lost-wax'],
    experienceIds: ['exp_bronze_casting_demo'],
    quote: 'To melt metal is to understand transformation. Every plaque we cast holds a moment of living history.',
    contactOptions: {
      inquiryEnabled: true,
      whatsappInquiry: true,
      callPermitted: false,
      displayEmail: 'c.okafor.foundry@culturelens-demo.ng'
    }
  }
];

export const EXPERIENCES: CulturalExperience[] = [
  {
    id: 'exp_asooke_workshop',
    slug: 'asooke-loom-workshop',
    artisanId: 'art_babatunde_adeyemi',
    title: 'Hands-on Aso-Òkè Loom Workshop: Weave Your First Strip',
    craft: 'Narrow-Loom Weaving',
    category: 'Textiles',
    shortSummary: 'Learn the synchronized foot-and-hand rhythm of the traditional horizontal loom under master guidance on Lagos Island.',
    description: 'Immerse yourself in a half-day masterclass inside Babatunde Adeyemi’s daylight-filled Lagos Island atelier. You will be introduced to warp and weft dynamics, thread tensioning, and the foot pedal choreography that defines Yoruba weaving. By the end of the session, you will weave and finish an authentic 1-meter commemorative Aso-Òkè narrow strip to take home.',
    whatToExpect: [
      'Comprehensive introduction to indigenous loom architecture and tools (itẹ, ọkọ, and asaa)',
      'Hands-on instruction setting up warp tension and spooling cotton thread',
      'Step-by-step guidance weaving personal pattern motifs into a commemorative band',
      'Tea, traditional refreshments, and curated storytelling on weaving proverbs'
    ],
    materialsProvided: [
      'Pre-warped bench loom setup for each participant',
      'Spools of 100% natural dyed organic cotton yarns',
      'Traditional hand-carved wooden shuttle and pick comb',
      'Archival gift envelope and provenance certificate for your finished textile'
    ],
    durationHours: 3.5,
    priceNaira: 35000,
    currency: 'NGN',
    maxCapacityPerSession: 6,
    locationMeetingPoint: 'Adeyemi Weaving Atelier, Freeman Street, Lagos Island',
    cancellationPolicy: 'Full refund up to 48 hours before session start. Cancellations within 48 hours can be rescheduled once without penalty.',
    publicationStatus: 'published',
    imageUrl: asoOkeCraftImg,
    sessions: [
      {
        id: 'sess_aso_01',
        date: '2026-10-18',
        time: '10:00 AM – 1:30 PM',
        capacity: 6,
        bookedCount: 3,
        status: 'available'
      },
      {
        id: 'sess_aso_02',
        date: '2026-10-25',
        time: '10:00 AM – 1:30 PM',
        capacity: 6,
        bookedCount: 5,
        status: 'available'
      },
      {
        id: 'sess_aso_03',
        date: '2026-11-01',
        time: '10:00 AM – 1:30 PM',
        capacity: 6,
        bookedCount: 6,
        status: 'full'
      }
    ]
  },
  {
    id: 'exp_adire_masterclass',
    slug: 'adire-eleko-masterclass',
    artisanId: 'art_bisi_folorunsho',
    title: 'Àdìrẹ Ẹlẹ́kọ Masterclass: Indigo Vats & Cassava Stenciling',
    craft: 'Indigo Dyeing & Resist',
    category: 'Textiles',
    shortSummary: 'Craft your own indigo shawl using cassava paste resist techniques and open-air fermentation vats.',
    description: 'Join revered master dyer Alhaja Bisi Folorunsho in an open-air dye courtyard in Yaba. You will learn to mix and apply fermented cassava paste (Ẹlẹ́kọ) onto fine cotton cloth using traditional stencils and freehand combs. While your designs dry in the tropical sun, explore the botanical science of indigo fermentation before dyeing your shawl through successive oxidations.',
    whatToExpect: [
      'History and cultural meaning of traditional Yoruba textile motifs',
      'Preparation of natural cassava starch resist paste',
      'Stenciling and freehand pattern application on 2 yards of pure cotton',
      'Guided multi-dip oxidation in traditional subterranean indigo vats'
    ],
    materialsProvided: [
      '2 yards of pre-washed premium white cotton',
      'Hand-carved metal stencils and wooden application combs',
      'Protective aprons, gloves, and traditional indigo washing salts',
      'Take-home care guide for hand-dyed natural indigo fabrics'
    ],
    durationHours: 4,
    priceNaira: 42000,
    currency: 'NGN',
    maxCapacityPerSession: 8,
    locationMeetingPoint: 'Mainland Indigo Compound, Commercial Avenue, Yaba, Lagos',
    cancellationPolicy: 'Refunds available up to 72 hours prior to workshop. Rescheduling permitted based on artisan dye schedule.',
    publicationStatus: 'published',
    imageUrl: adireIndigoImg,
    sessions: [
      {
        id: 'sess_adire_01',
        date: '2026-10-17',
        time: '09:30 AM – 1:30 PM',
        capacity: 8,
        bookedCount: 4,
        status: 'available'
      },
      {
        id: 'sess_adire_02',
        date: '2026-10-24',
        time: '09:30 AM – 1:30 PM',
        capacity: 8,
        bookedCount: 2,
        status: 'available'
      }
    ]
  },
  {
    id: 'exp_ileke_stringing',
    slug: 'ileke-bead-stringing',
    artisanId: 'art_kemi_balogun',
    title: 'Sacred Ìlẹ̀kẹ̀ Bead Stringing & Royal Color Symbolism',
    craft: 'Royal Beadwork',
    category: 'Beadwork',
    shortSummary: 'String an authentic commemorative necklace or wristpiece while learning the royal color symbology of Yoruba courts.',
    description: 'Spend an inspiring afternoon in Kemi Balogun’s studio exploring the tactile world of Nigerian beadwork. You will examine antique trade beads, terracotta beads, and natural coral, discovering how specific color combinations reflect spiritual calm, fertility, and authority. Under Kemi’s guidance, craft a bespoke piece strung on durable fiber with hand-cast brass clasps.',
    whatToExpect: [
      'Interactive visual lecture on royal court beads from Ile-Ife and Oyo',
      'Guidance in bead selection, symmetry, and tension braiding',
      'Assembling your custom necklace or double-strand bracelet with brass accents',
      'Artisan-curated refreshments and conversational Q&A'
    ],
    materialsProvided: [
      'Curated tray of authentic glass beads, coral-toned beads, and brass charms',
      'Heavy-duty wax-coated stringing fibers and jewelers tools',
      'Velvet storage pouch and historical origin booklet'
    ],
    durationHours: 2.5,
    priceNaira: 30000,
    currency: 'NGN',
    maxCapacityPerSession: 8,
    locationMeetingPoint: 'Balogun Studio, Admiralty Way, Lekki Phase 1, Lagos',
    cancellationPolicy: 'Full refund up to 24 hours in advance.',
    publicationStatus: 'published',
    imageUrl: beadmakingImg,
    sessions: [
      {
        id: 'sess_ileke_01',
        date: '2026-10-19',
        time: '02:00 PM – 4:30 PM',
        capacity: 8,
        bookedCount: 6,
        status: 'available'
      },
      {
        id: 'sess_ileke_02',
        date: '2026-10-26',
        time: '02:00 PM – 4:30 PM',
        capacity: 8,
        bookedCount: 3,
        status: 'available'
      }
    ]
  },
  {
    id: 'exp_terracotta_wheel',
    slug: 'terracotta-vessel-shaping',
    artisanId: 'art_omowunmi_bello',
    title: 'Living Earth: Hand-Shaping Nigerian Earthenware Vessels',
    craft: 'Pottery & Ceramics',
    category: 'Pottery & Ceramics',
    shortSummary: 'Shape natural river clay using ancient coil and paddle techniques in a tranquil Surulere ceramic courtyard.',
    description: 'Connect directly with the earth in this foundational ceramics workshop. Omowunmi Bello demonstrates how traditional Yoruba women potters prepared river clay and shaped monumental vessels without wheels. You will learn pinch, coil, and paddle-burnishing techniques, shaping a functional earthenware bowl or tea vessel that will be fired and sealed with natural locust bean extract.',
    whatToExpect: [
      'Tactile introduction to local clay preparation and grog blending',
      'Hands-on coiling and wooden paddle shaping',
      'Surface burnishing using smooth river quartz stones',
      'Studio firing and post-firing pick-up arrangement'
    ],
    materialsProvided: [
      '4kg of prepared local alluvial clay',
      'Wooden paddles, ribs, and smoothing stones',
      'Studio firing service (ready for collection in 10 days or delivery)'
    ],
    durationHours: 3,
    priceNaira: 28000,
    currency: 'NGN',
    maxCapacityPerSession: 6,
    locationMeetingPoint: 'Bello Pottery Atelier, Ogunlana Drive, Surulere, Lagos',
    cancellationPolicy: 'Refunds permitted up to 48 hours prior to workshop.',
    publicationStatus: 'published',
    imageUrl: potteryStudioImg,
    sessions: [
      {
        id: 'sess_pot_01',
        date: '2026-10-20',
        time: '11:00 AM – 2:00 PM',
        capacity: 6,
        bookedCount: 2,
        status: 'available'
      },
      {
        id: 'sess_pot_02',
        date: '2026-10-27',
        time: '11:00 AM – 2:00 PM',
        capacity: 6,
        bookedCount: 6,
        status: 'full'
      }
    ]
  },
  {
    id: 'exp_bronze_casting_demo',
    slug: 'benin-bronze-lost-wax-demo',
    artisanId: 'art_chidiebere_okafor',
    title: 'Fire & Memory: Traditional Lost-Wax Metallurgy Demonstration',
    craft: 'Foundry & Bronze Casting',
    category: 'Metalcraft & Bronze',
    shortSummary: 'Witness the ancestral cire perdue process from wax sculpting to molten metal pour in Maryland, Lagos.',
    description: 'An exclusive documentary-style masterclass and foundry demonstration with foundry artisan Chidiebere Okafor. Witness the complex multi-stage process of West African lost-wax casting. Each participant carves an original beeswax medallion, invests it in refractory slurry, and observes a controlled crucible furnace pour.',
    whatToExpect: [
      'Historical overview of ancient Nigerian metallurgical guilds',
      'Carving and tooling your personal beeswax medallion model',
      'Detailed furnace demonstration with temperature control and alloy safety',
      'Chiseling and patina finishing of cast metal souvenirs'
    ],
    materialsProvided: [
      'Refined beeswax carving blanks and sculpting knives',
      'Safety goggles, heavy leather foundry gloves, and apron',
      'Your finished solid cast brass medallion'
    ],
    durationHours: 4,
    priceNaira: 45000,
    currency: 'NGN',
    maxCapacityPerSession: 6,
    locationMeetingPoint: 'Maryland Foundry Studios, Anthony Village corridor, Lagos',
    cancellationPolicy: 'Strict 72-hour cancellation notice required due to furnace pre-firing logistics.',
    publicationStatus: 'published',
    imageUrl: heroCraftsImg,
    sessions: [
      {
        id: 'sess_brz_01',
        date: '2026-10-21',
        time: '10:00 AM – 2:00 PM',
        capacity: 6,
        bookedCount: 3,
        status: 'available'
      }
    ]
  }
];

export const MOCK_QNA_RESPONSES: Record<string, QnAResponse> = {
  'adire-indigo': {
    id: 'qna_adire_indigo',
    question: 'What is the cultural and symbolic meaning of natural indigo in Yoruba Adire?',
    answer: 'In Yoruba culture, natural indigo (elu) represents endurance, cool-headed dignity (itutu), and feminine ancestral continuity. The dyeing process is historically overseen by elder women guilds known as Iya Alaro. The deep midnight hue is considered a sacred protective color that shields the wearer. Unlike artificial chemical dyes, authentic Adire Eleko uses fermented cassava starch (eleko) resist paste, creating geometric grids where each motif encodes an oral proverb, such as Olokun (spirit of the deep sea) or Oredegbe (companionship).',
    groundedRecordSlugs: ['adire-eleko-indigo'],
    associatedArtisanIds: ['art_bisi_folorunsho'],
    uncertaintyOrDisputeNotes: 'While historical documentation confirms Abeokuta as the premier 19th-century center of Adire Eleko, regional variants in Osogbo and Ibadan employ distinct leaf varieties with varying mordant preparations.',
    confidence: 'high'
  },
  'aso-oke-looms': {
    id: 'qna_aso_oke_looms',
    question: 'How does Aso-Oke weaving differ between traditional horizontal and vertical looms?',
    answer: 'In southwestern Nigerian tradition, two distinct loom technologies exist: the narrow horizontal treadle loom (traditionally operated by men in guilds such as Iseyin) and the upright broadloom or vertical frame loom (historically operated by women in domestic courtyards). The horizontal narrow loom produces narrow strips (circa 10-15cm wide) woven at great speed using foot pedals and hand shuttles, which are subsequently joined selvedge-to-selvedge. The vertical loom produces wider single-width cloth panels. Both traditions produce prestigious ceremonial garments including Sanyan, Etu, and Alaari.',
    groundedRecordSlugs: ['aso-oke-weaving'],
    associatedArtisanIds: ['art_babatunde_adeyemi'],
    uncertaintyOrDisputeNotes: 'Historically gendered divisions of labor regarding loom types have become fluid in contemporary urban Lagos and Osun workshops, where both male and female weavers operate narrow treadle looms.',
    confidence: 'high'
  },
  'benin-bronze-casting': {
    id: 'qna_benin_bronze_casting',
    question: 'What materials and techniques were used in ancient Benin bronze casting?',
    answer: 'Benin metalwork relies on the lost-wax (cire perdue) technique practiced by the hereditary Igun Eronmwon guild along Igun Street under direct commission from the Oba. The process utilizes a refractory clay core shaped from river sediment, meticulously sculpted beeswax, and multiple investment layers of charcoal slip. The alloy is predominantly copper-zinc brass or tin-bronze, melted in crucible pit furnaces fueled with dense hardwood charcoal. Once poured and cooled, the outer clay mould is broken open—making each casting a unique singular art piece.',
    groundedRecordSlugs: ['benin-bronze-lost-wax'],
    associatedArtisanIds: ['art_chidiebere_okafor'],
    uncertaintyOrDisputeNotes: 'Scholarly analyses indicate the metallurgical composition of Benin castings shifted from high-tin bronze to imported brass manillas from European trade in the late 15th century, but the indigenous casting methodology predates European arrivals.',
    confidence: 'high'
  },
  'ileke-beads': {
    id: 'qna_ileke_beads',
    question: 'Who makes authentic royal Yoruba Ileke beads and what do the colors signify?',
    answer: 'Authentic royal Ileke beads are traditionally crafted and strung by hereditary guild artisans associated with palace royal compounds in Ile-Ife, Oyo, and Benin. Specific colors carry precise cosmological designations: red Mediterranean coral (Iyun) and terracotta beads denote supreme royal dignity and nobility; opaque white glass denotes Obatala (clarity and purity); striped blue-and-white denotes Yemoja (oceanic maternal grace); and amber/yellow denotes Oshun (fertility and sweetness). Modern custodians in Lagos like Kemi Balogun continue these stringing protocols using authenticated beads.',
    groundedRecordSlugs: ['ileke-beadwork'],
    associatedArtisanIds: ['art_kemi_balogun'],
    uncertaintyOrDisputeNotes: 'Bead varieties from trans-Saharan caravan exchanges and European trade were incorporated alongside indigenous Ile-Ife dichroic glass beads from the 12th century onwards.',
    confidence: 'high'
  }
};
