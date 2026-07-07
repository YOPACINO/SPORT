/* ===== MonSport — app complète (muscu, cardio GPS, photos, bien-être) ===== */
/* 100% local, gratuit, hors-ligne. Aucune donnée envoyée sur internet. */

const ICONS = {
  bras:'<path d="M6 12h4l2-4 3 8 2-4h1"/>',
  jambes:'<path d="M8 3v7l-2 11M16 3v7l2 11M8 10h8"/>',
  pecs:'<path d="M4 8c4 0 4 3 8 3s4-3 8-3M4 8v4c0 4 4 6 8 6s8-2 8-6V8"/>',
  dos:'<path d="M12 3v18M7 7l5-2 5 2M6 12l6-2 6 2"/>',
  epaules:'<path d="M4 14c0-4 3-7 8-7s8 3 8 7M8 14v4M16 14v4"/>',
  cardio:'<path d="M20 9a5 5 0 00-8-4 5 5 0 00-8 4c0 6 8 10 8 10s8-4 8-10z"/>',
  abdos:'<path d="M6 4h12v16H6zM6 9h12M6 14h12M12 4v16"/>'
};

const DEFAULT_GROUPS = [
  {id:'pecs',    name:'Pecs',    color:'#d85a30', exos:['Développé couché','Développé incliné','Écarté poulie','Pompes']},
  {id:'dos',     name:'Dos',     color:'#378add', exos:['Tractions','Rowing barre','Tirage vertical','Soulevé de terre']},
  {id:'jambes',  name:'Jambes',  color:'#1d9e75', exos:['Squat','Presse','Fentes','Leg curl']},
  {id:'epaules', name:'Épaules', color:'#ba7517', exos:['Développé militaire','Élévations latérales','Oiseau']},
  {id:'bras',    name:'Bras',    color:'#7f77dd', exos:['Curl biceps','Dips','Barre au front','Curl marteau']},
  {id:'abdos',   name:'Abdos',   color:'#0f6e56', exos:['Crunch','Gainage','Relevé de jambes']},
];

const STRETCH_ROUTINES = [
  {id:'matin', name:'Réveil matinal', color:'#ba7517', steps:[
    {name:'Étirement nuque', sec:20},{name:'Rotation épaules', sec:20},
    {name:'Étirement latéral droit', sec:25},{name:'Étirement latéral gauche', sec:25},
    {name:'Flexion avant', sec:30},{name:'Chat-vache', sec:30}]},
  {id:'jambes', name:'Post-séance jambes', color:'#1d9e75', steps:[
    {name:'Quadriceps droit', sec:30},{name:'Quadriceps gauche', sec:30},
    {name:'Ischio droit', sec:30},{name:'Ischio gauche', sec:30},
    {name:'Mollet droit', sec:25},{name:'Mollet gauche', sec:25},{name:'Fessiers', sec:30}]},
  {id:'dos', name:'Dos & nuque', color:'#378add', steps:[
    {name:'Étirement nuque côté', sec:25},{name:'Étirement trapèzes', sec:25},
    {name:'Torsion assise droite', sec:30},{name:'Torsion assise gauche', sec:30},
    {name:'Posture de l\'enfant', sec:40},{name:'Cobra', sec:30}]},
  {id:'full', name:'Full body détente', color:'#7f77dd', steps:[
    {name:'Pectoraux porte', sec:30},{name:'Triceps droit', sec:25},{name:'Triceps gauche', sec:25},
    {name:'Fente coureur droit', sec:30},{name:'Fente coureur gauche', sec:30},
    {name:'Étirement dos complet', sec:35},{name:'Respiration profonde', sec:40}]},
];

/* Bibliothèque d'étirements — dictionnaire (target = muscle surligné sur le schéma) */
const S = {
  nuque_cote:{name:'Inclinaison latérale de la nuque',level:'Débutant',sec:30,target:'nuque',steps:['Assis ou debout, dos droit.','Incline doucement la tête vers l\'épaule droite.','Pose la main droite sur la tempe pour un léger poids (sans forcer).','Répète de l\'autre côté.'],tips:'Garde les épaules basses et relâchées.'},
  nuque_avant:{name:'Étirement arrière de la nuque',level:'Débutant',sec:25,target:'nuque',steps:['Menton vers la poitrine.','Mains croisées derrière la tête, laisse le poids étirer la nuque.'],tips:'Respire lentement, ne tire pas fort.'},
  trapezes:{name:'Étirement des trapèzes',level:'Débutant',sec:30,target:'epaules',steps:['Main droite derrière le dos.','Incline la tête vers l\'épaule gauche.','Change de côté.'],tips:'Sensation le long du cou/épaule.'},
  epaule_croise:{name:'Épaule bras croisé',level:'Débutant',sec:30,target:'epaules',steps:['Tends le bras droit devant toi.','Ramène-le contre la poitrine avec l\'avant-bras gauche.','Change de bras.'],tips:'Garde l\'épaule basse.'},
  triceps:{name:'Triceps (coude derrière la tête)',level:'Débutant',sec:30,target:'triceps',steps:['Lève le bras droit, plie le coude, main entre les omoplates.','Pousse doucement le coude avec la main gauche.','Change de côté.'],tips:'Buste droit, n\'arrondis pas le dos.'},
  poignets:{name:'Poignets & avant-bras',level:'Débutant',sec:25,target:'avantbras',steps:['Bras tendu devant, paume vers le bas.','Avec l\'autre main, tire les doigts vers toi puis vers le bas.'],tips:'Idéal après muscu ou clavier.'},
  pecs_porte:{name:'Pectoraux à la porte',level:'Débutant',sec:30,target:'pecs',steps:['Avant-bras contre un mur/cadre de porte, coude à ~90°.','Avance doucement le buste jusqu\'à sentir l\'étirement du pec.','Change de côté.'],tips:'Ne cambre pas trop le bas du dos.'},
  pecs_dos:{name:'Mains jointes derrière le dos',level:'Débutant',sec:30,target:'pecs',steps:['Joins les mains derrière le dos.','Monte doucement les bras en ouvrant la poitrine.'],tips:'Ouvre les épaules vers l\'arrière.'},
  enfant:{name:'Posture de l\'enfant',level:'Débutant',sec:40,target:'dos',steps:['À genoux, assieds-toi sur les talons.','Penche le buste vers l\'avant, bras tendus devant.','Front vers le sol, relâche.'],tips:'Respire dans le bas du dos.'},
  chat_vache:{name:'Chat-vache',level:'Débutant',sec:30,target:'dos',steps:['À quatre pattes.','Inspire en creusant le dos (vache), expire en arrondissant (chat).','Enchaîne lentement.'],tips:'Mobilise toute la colonne.'},
  torsion_sol:{name:'Torsion vertébrale allongée',level:'Débutant',sec:30,target:'dos',steps:['Allongé sur le dos, ramène le genou droit.','Bascule-le vers la gauche, bras droit ouvert au sol.','Regarde à droite. Change de côté.'],tips:'Garde les deux épaules au sol.'},
  cobra:{name:'Cobra',level:'Intermédiaire',sec:30,target:'dos',steps:['Allongé sur le ventre, mains sous les épaules.','Pousse pour lever le buste, bassin au sol.','Ouvre la poitrine.'],tips:'Épaules loin des oreilles.'},
  lateral_debout:{name:'Inclinaison latérale debout',level:'Débutant',sec:30,target:'obliques',steps:['Debout, bras droit au-dessus de la tête.','Incline le buste vers la gauche.','Change de côté.'],tips:'Grandis-toi avant d\'incliner.'},
  torsion_assise:{name:'Torsion assise',level:'Débutant',sec:30,target:'obliques',steps:['Assis, jambe droite pliée passée par-dessus la gauche.','Tourne le buste vers la droite, coude gauche à l\'extérieur du genou.','Change de côté.'],tips:'Dos droit pendant la torsion.'},
  pigeon:{name:'Pigeon (fessier)',level:'Intermédiaire',sec:40,target:'fessiers',steps:['Genou droit avancé plié, tibia devant toi.','Jambe gauche tendue derrière.','Penche le buste vers l\'avant. Change de côté.'],tips:'Excellent pour l\'ouverture de hanche.'},
  figure4:{name:'Fessier allongé (figure 4)',level:'Débutant',sec:30,target:'fessiers',steps:['Sur le dos, cheville droite sur le genou gauche.','Attrape l\'arrière de la cuisse gauche et ramène vers toi.','Change de côté.'],tips:'Idéal sciatique/fessier profond.'},
  fente_hanche:{name:'Fléchisseurs de hanche (fente)',level:'Intermédiaire',sec:30,target:'hanches',steps:['Fente basse, genou arrière au sol.','Pousse le bassin vers l\'avant.','Sensation à l\'avant de la hanche arrière. Change de côté.'],tips:'Rentre légèrement le bassin.'},
  quad_debout:{name:'Quadriceps debout',level:'Débutant',sec:30,target:'quadriceps',steps:['Debout, attrape la cheville droite derrière toi.','Ramène le talon vers la fesse, genoux serrés.','Change de côté.'],tips:'Tiens-toi à un mur pour l\'équilibre.'},
  quad_fente:{name:'Quadriceps en fente basse',level:'Intermédiaire',sec:30,target:'quadriceps',steps:['Genou arrière au sol, attrape le pied arrière.','Ramène le talon vers la fesse.','Change de côté.'],tips:'Version plus intense du quadriceps.'},
  ischio_debout:{name:'Ischios debout (pince)',level:'Débutant',sec:30,target:'ischios',steps:['Debout, jambes tendues.','Penche le buste vers l\'avant, mains vers les pieds.','Relâche la nuque.'],tips:'Plie légèrement les genoux si besoin.'},
  ischio_assis:{name:'Ischios assis jambe tendue',level:'Débutant',sec:30,target:'ischios',steps:['Assis, jambe droite tendue, gauche repliée.','Penche vers le pied droit, dos droit.','Change de côté.'],tips:'Va chercher depuis les hanches.'},
  ischio_mur:{name:'Ischios au mur (allongé)',level:'Débutant',sec:40,target:'ischios',steps:['Allongé, fesses près d\'un mur.','Monte la jambe tendue contre le mur.','Change de côté.'],tips:'Doux et sans forcer, parfait le soir.'},
  papillon:{name:'Papillon (adducteurs)',level:'Débutant',sec:40,target:'adducteurs',steps:['Assis, plantes de pieds jointes.','Attrape les pieds, laisse les genoux descendre.','Penche légèrement le buste en avant.'],tips:'Base du grand écart facial.'},
  grenouille:{name:'Grenouille',level:'Avancé',sec:40,target:'adducteurs',steps:['À quatre pattes, écarte progressivement les genoux.','Tibias alignés, descends le bassin vers l\'arrière.'],tips:'Très efficace pour l\'écart facial. Va doucement.'},
  fente_laterale:{name:'Fente latérale',level:'Intermédiaire',sec:30,target:'adducteurs',steps:['Grand pas sur le côté, plie une jambe, l\'autre tendue.','Descends le bassin côté jambe pliée.','Change de côté.'],tips:'Talon tendu bien à plat.'},
  mollet_mur:{name:'Mollet au mur (gastrocnémien)',level:'Débutant',sec:30,target:'mollets',steps:['Mains au mur, jambe droite tendue derrière.','Talon au sol, avance le bassin.','Change de côté.'],tips:'Jambe arrière bien tendue.'},
  mollet_soleaire:{name:'Soléaire (genou fléchi)',level:'Débutant',sec:30,target:'mollets',steps:['Même position, mais plie légèrement le genou arrière.','Talon au sol.','Change de côté.'],tips:'Cible le mollet profond.'},
  chevilles:{name:'Rotations de chevilles',level:'Débutant',sec:20,target:'chevilles',steps:['Pied en l\'air, dessine des cercles lents.','Change de sens, puis de pied.'],tips:'Bon échauffement articulaire.'},
  chameau:{name:'Chameau',level:'Avancé',sec:30,target:'dos',steps:['À genoux, mains sur les talons.','Pousse le bassin vers l\'avant, ouvre la poitrine.'],tips:'Progression vers le pont.'},
  pont_epaules:{name:'Pont sur les épaules',level:'Intermédiaire',sec:30,target:'dos',steps:['Sur le dos, genoux pliés, pieds au sol.','Monte le bassin, serre les fessiers.'],tips:'Base du pont complet.'},
  coiffe_int:{name:'Coiffe des rotateurs — rotation interne',level:'Intermédiaire',sec:30,target:'epaules',steps:['Avant-bras plié à 90° derrière le bas du dos.','Avec l\'autre main, tire doucement le poignet vers le haut du dos.','Change de côté.'],tips:'Mouvement lent, jamais dans la douleur.'},
  coiffe_ext:{name:'Coiffe des rotateurs — rotation externe',level:'Intermédiaire',sec:30,target:'epaules',steps:['Coude collé au corps, avant-bras plié à 90°.','Amène l\'avant-bras vers l\'extérieur contre un cadre de porte.','Change de côté.'],tips:'Garde le coude contre les côtes.'},
  deltoide_post:{name:'Deltoïde postérieur allongé',level:'Débutant',sec:30,target:'epaules',steps:['Allongé sur le dos, bras tendu au sol paume vers le ciel.','Roule légèrement le buste vers ce bras.','Change de côté.'],tips:'Sensation à l\'arrière de l\'épaule.'},
  biceps_mur:{name:'Biceps au mur',level:'Débutant',sec:30,target:'biceps',steps:['Main à plat sur un mur derrière toi, bras tendu à hauteur d\'épaule.','Tourne doucement le buste dans le sens opposé.','Change de bras.'],tips:'Bras bien tendu, épaule basse.'},
  poignet_pro:{name:'Poignets en pronation (au sol)',level:'Débutant',sec:25,target:'avantbras',steps:['À genoux, paumes au sol, doigts orientés vers toi.','Recule doucement le bassin.'],tips:'Va progressivement, poignets sensibles.'},
  poignet_sup:{name:'Poignets en supination (au sol)',level:'Débutant',sec:25,target:'avantbras',steps:['Paumes au sol, dos des mains vers l\'avant (doigts vers les genoux).','Recule légèrement le bassin.'],tips:'Version douce si tu débutes.'},
  hanche_int:{name:'Hanche — rotation interne',level:'Intermédiaire',sec:30,target:'hanches',steps:['Assis, une jambe tendue, l\'autre pliée sur le côté (genou vers l\'intérieur).','Pousse doucement le genou vers le sol.','Change de côté.'],tips:'Garde le buste droit.'},
  hanche_ext:{name:'Hanche — rotation externe',level:'Débutant',sec:30,target:'hanches',steps:['Assis, cheville posée sur le genou opposé.','Pousse doucement le genou vers le bas.','Change de côté.'],tips:'Sensation dans la fesse / hanche.'},
  cheville_inv:{name:'Cheville — inversion',level:'Débutant',sec:20,target:'chevilles',steps:['Debout, pose le bord externe du pied au sol.','Penche-toi doucement dessus, jambe tendue.','Change de pied.'],tips:'Léger — les chevilles sont fragiles.'},
  cheville_ev:{name:'Cheville — éversion',level:'Débutant',sec:20,target:'chevilles',steps:['Debout, pose le bord interne du pied au sol.','Amène doucement le genou vers l\'intérieur.','Change de pied.'],tips:'Amplitude réduite, sans forcer.'},
  cheville_plant:{name:'Cheville — flexion plantaire',level:'Débutant',sec:20,target:'chevilles',steps:['Debout, pose le dessus du pied au sol derrière toi.','Enroule doucement en pliant légèrement la jambe.','Change de pied.'],tips:'Étire le dessus du pied et le tibia.'},
  grand_dorsal:{name:'Grand dorsal au support',level:'Débutant',sec:30,target:'dos',steps:['Tiens un support à deux mains, bras tendus.','Recule les hanches, laisse le buste descendre.','Oriente légèrement d\'un côté puis de l\'autre.'],tips:'Étire les côtés du dos.'},
  lombaires:{name:'Lombaires (dos rond assis)',level:'Débutant',sec:30,target:'abdos',steps:['Assis, jambes devant toi.','Arrondis le dos en amenant le ventre vers les cuisses.','Rentre le nombril.'],tips:'Contracte légèrement les abdos.'},
  abdos_cobra:{name:'Abdos (grand droit)',level:'Intermédiaire',sec:30,target:'abdos',steps:['Allongé sur le ventre, mains sous les épaules.','Pousse pour lever le buste, bassin au sol.','Respire lentement, poitrine ouverte.'],tips:'Contrôle bien la respiration.'},
  respiration:{name:'Respiration profonde',level:'Débutant',sec:40,target:'corps',steps:['Allongé, mains sur le ventre.','Inspire 4s par le nez, expire 6s par la bouche.'],tips:'Termine ta séance en relâchant tout.'}
};

const STRETCH_ZONES = [
  {id:'nuque',   name:'Nuque & cou',       color:'#ba7517', keys:['nuque_cote','nuque_avant','trapezes']},
  {id:'epaules', name:'Épaules',            color:'#d85a30', keys:['epaule_croise','deltoide_post','coiffe_int','coiffe_ext','trapezes']},
  {id:'bras',    name:'Bras & poignets',    color:'#7f77dd', keys:['triceps','biceps_mur','poignets','poignet_pro','poignet_sup']},
  {id:'pecs',    name:'Poitrine',           color:'#e0694a', keys:['pecs_porte','pecs_dos']},
  {id:'dos',     name:'Dos & colonne',      color:'#378add', keys:['enfant','chat_vache','torsion_sol','cobra','grand_dorsal']},
  {id:'abdos',   name:'Abdos & lombaires',  color:'#0f6e56', keys:['abdos_cobra','lombaires']},
  {id:'cotes',   name:'Côtés (obliques)',   color:'#16a34a', keys:['lateral_debout','torsion_assise']},
  {id:'hanches', name:'Hanches & fessiers', color:'#1d9e75', keys:['pigeon','figure4','fente_hanche','hanche_int','hanche_ext']},
  {id:'quad',    name:'Cuisses (quadriceps)',color:'#d4537e',keys:['quad_debout','quad_fente']},
  {id:'ischio',  name:'Arrière-cuisses',    color:'#3b82f6', keys:['ischio_debout','ischio_assis','ischio_mur']},
  {id:'add',     name:'Intérieur cuisses',  color:'#22c55e', keys:['papillon','grenouille','fente_laterale']},
  {id:'mollets', name:'Mollets & chevilles',color:'#9333ea', keys:['mollet_mur','mollet_soleaire','cheville_inv','cheville_ev','cheville_plant','chevilles']},
];

const FLEX_GOALS = [
  {id:'facial', name:'Grand écart facial (horizontal)', desc:'Ouverture des adducteurs et hanches', color:'#22c55e',
    keys:['papillon','fente_laterale','grenouille','ischio_assis','fente_hanche']},
  {id:'avant_d', name:'Grand écart avant — jambe droite', desc:'Fléchisseurs, quadriceps et ischios', color:'#d4537e',
    keys:['fente_hanche','quad_fente','ischio_debout','pigeon']},
  {id:'avant_g', name:'Grand écart avant — jambe gauche', desc:'Fléchisseurs, quadriceps et ischios', color:'#d4537e',
    keys:['fente_hanche','quad_fente','ischio_debout','pigeon']},
  {id:'pont', name:'Le pont (bridge)', desc:'Ouverture de la colonne et des épaules', color:'#378add',
    keys:['cobra','pecs_dos','chameau','pont_epaules']},
  {id:'pince', name:'Toucher ses pieds', desc:'Souplesse ischios et dos', color:'#3b82f6',
    keys:['ischio_debout','ischio_assis','ischio_mur','enfant']},
];

const BODY_TARGETS={
  nuque:[50,26,9,6], epaules:[50,33,23,6], pecs:[50,42,17,9], triceps:[70,45,7,13], biceps:[30,45,7,13], avantbras:[72,60,6,11],
  dos:[50,50,16,13], abdos:[50,52,15,11], obliques:[50,54,23,11], fessiers:[50,66,18,8], hanches:[50,63,17,6],
  quadriceps:[50,88,16,18], ischios:[50,90,16,18], adducteurs:[50,82,9,17], mollets:[50,115,14,14],
  chevilles:[50,130,12,6], corps:[50,80,30,72]
};
function bodyMap(target,accent){
  const t=BODY_TARGETS[target]||BODY_TARGETS.corps, c=accent||'#3b82f6';
  return `<svg viewBox="0 0 100 165" style="width:100%;height:100%">
    <g fill="#3a3f4c">
      <circle cx="50" cy="15" r="11"/><rect x="45" y="25" width="10" height="6" rx="3"/>
      <rect x="37" y="30" width="26" height="42" rx="11"/>
      <rect x="25" y="32" width="9" height="37" rx="4.5"/><rect x="66" y="32" width="9" height="37" rx="4.5"/>
      <rect x="23" y="66" width="7" height="13" rx="3.5"/><rect x="70" y="66" width="7" height="13" rx="3.5"/>
      <rect x="39" y="69" width="10" height="55" rx="5"/><rect x="51" y="69" width="10" height="55" rx="5"/>
      <rect x="39" y="123" width="10" height="16" rx="3"/><rect x="51" y="123" width="10" height="16" rx="3"/>
    </g>
    <ellipse cx="${t[0]}" cy="${t[1]}" rx="${t[2]}" ry="${t[3]}" fill="${c}" opacity="0.6"/>
  </svg>`;
}

const BEAUTY_ROUTINES = [
  {id:'matin', name:'Routine matin', color:'#d4537e', icon:'sun', steps:['Nettoyant doux','Sérum vitamine C','Hydratant','Crème solaire SPF50']},
  {id:'soir', name:'Routine soir', color:'#7f77dd', icon:'moon', steps:['Démaquillant','Nettoyant','Sérum / rétinol','Crème de nuit','Baume lèvres']},
  {id:'hebdo', name:'Soin hebdomadaire', color:'#1d9e75', icon:'star', steps:['Gommage visage','Masque purifiant','Gommage corps','Hydratation intense','Soin cheveux']},
];

const BEAUTY_ICONS = {
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
  moon:'<path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/>',
  star:'<path d="M12 3l2.5 6 6.5.5-5 4.3 1.6 6.4L12 17l-5.6 3.2L8 13.8l-5-4.3L9.5 9z"/>'
};

const DB_KEY = 'monsport_v1';
let DB = load();

function load(){
  try{ const d = JSON.parse(localStorage.getItem(DB_KEY)); if(d && d.exos) return migrate(d); }catch(e){}
  const exos = {};
  DEFAULT_GROUPS.forEach(g=>{ exos[g.id] = g.exos.map((n,i)=>({id:g.id+'_'+i, name:n, logs:[]})); });
  return migrate({ name:'', groups:DEFAULT_GROUPS.map(({exos,...g})=>g), exos, cardio:[], photos:[],
           beauty:{}, reminders:{stretch:{on:false,time:'18:00'}, beauty_m:{on:false,time:'08:00'}, beauty_s:{on:false,time:'21:00'}} });
}
function migrate(d){
  d.cardio = d.cardio||[]; d.photos = d.photos||[]; d.beauty = d.beauty||{};
  d.reminders = d.reminders||{stretch:{on:false,time:'18:00'}, beauty_m:{on:false,time:'08:00'}, beauty_s:{on:false,time:'21:00'}};
  d.health = d.health||null;
  d.strava = d.strava||null;
  d.nutrition = d.nutrition||{goalKcal:2200, goalProt:180, days:{}, recent:[], meals:[]};
  d.coach = d.coach||{vid:{}, note:{}};
  return d;
}
function save(){ try{ localStorage.setItem(DB_KEY, JSON.stringify(DB)); }catch(e){ alert('Mémoire pleine — supprime quelques photos.'); } }

const $ = id => document.getElementById(id);
const fmtDate = iso => new Date(iso).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'});
const fmtFull = iso => new Date(iso).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const todayISO = () => new Date().toISOString().slice(0,10);
const nowTs = () => 'id'+Math.floor(performance.now()*1000)+Math.floor((performance.now()%1)*1e6);
function allLogs(){ let a=[]; Object.entries(DB.exos).forEach(([gid,list])=>list.forEach(e=>e.logs.forEach(l=>a.push({...l,exo:e.name,gid,eid:e.id})))); return a; }
function exoById(gid,eid){ return (DB.exos[gid]||[]).find(e=>e.id===eid); }
function fmtTime(sec){ const m=Math.floor(sec/60), s=sec%60; return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); }

let cur = { gid:null, eid:null };
let pendingPhoto = null, pendingProgress = null;

/* ============ ACCUEIL ============ */
function renderHome(){
  $('todaydate').textContent = new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
  const logs = allLogs();
  const days = new Set(logs.map(l=>l.date)).size + DB.cardio.length;
  const volume = logs.reduce((s,l)=>s+(l.weight||0)*(l.reps||0)*(l.sets||1),0);
  const km = DB.cardio.reduce((s,c)=>s+(c.dist||0),0);
  $('st-seances').textContent = days;
  $('st-volume').textContent = (volume/1000).toFixed(1);
  $('st-km').textContent = km.toFixed(1);

  $('groups').innerHTML = DB.groups.map(g=>{
    const c=(DB.exos[g.id]||[]).length;
    return `<div class="group" data-g="${g.id}">
      <div class="dot" style="background:${g.color}"><svg viewBox="0 0 24 24">${ICONS[g.id]||ICONS.pecs}</svg></div>
      <div><div class="name">${g.name}</div><div class="count">${c} exos</div></div></div>`;
  }).join('');
  document.querySelectorAll('#groups .group').forEach(el=>el.onclick=()=>openGroup(el.dataset.g));

  const recent = allLogs().sort((a,b)=>b.date<a.date?-1:1).slice(0,4);
  $('recent').innerHTML = recent.length ? recent.map(l=>`
    <div class="ex-row" style="cursor:pointer" data-g="${l.gid}" data-e="${l.eid}">
      <div class="ex-thumb">${l.photo?`<img src="${l.photo}">`:`<svg viewBox="0 0 24 24"><path d="M6 12h4l2-4 3 8 2-4h1"/></svg>`}</div>
      <div class="ex-info"><div class="t">${l.exo}</div><div class="s">${fmtDate(l.date)}</div></div>
      <div class="ex-info" style="flex:0"><div class="pr">${l.weight?l.weight+' kg':''}${l.reps?' × '+l.reps:''}</div></div>
    </div>`).join('')
    : `<div class="empty"><svg viewBox="0 0 24 24"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg><div>Aucune séance pour l'instant.<br>Choisis un muscle et lance-toi 💪</div></div>`;
  document.querySelectorAll('#recent .ex-row').forEach(el=>el.onclick=()=>openExo(el.dataset.g, el.dataset.e));
}

/* ============ GROUPE ============ */
function openGroup(gid){
  cur.gid=gid;
  const g=DB.groups.find(x=>x.id===gid);
  $('group-title').textContent=g.name;
  const list=DB.exos[gid]||[];
  $('group-sub').textContent=list.length+' exercices';
  $('ex-add-desc').textContent=g.name;
  $('ex-list').innerHTML=list.map(e=>{
    const last=e.logs[e.logs.length-1];
    const pr=e.logs.reduce((m,l)=>Math.max(m,l.weight||0),0);
    return `<div class="ex-row" data-e="${e.id}">
      <div class="ex-thumb">${last&&last.photo?`<img src="${last.photo}">`:`<svg viewBox="0 0 24 24"><path d="M4 12h3l2-5 3 10 2-5h6"/></svg>`}</div>
      <div class="ex-info"><div class="t">${e.name}</div><div class="s">${e.logs.length?e.logs.length+' séries · '+fmtDate(last.date):'Jamais fait'}</div></div>
      <div class="ex-info" style="flex:0;text-align:right"><div class="pr">${pr?pr+' kg':''}</div></div>
      <svg class="chev" style="width:20px;height:20px;stroke:currentColor;stroke-width:2;fill:none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></div>`;
  }).join('')||`<div class="empty">Aucun exercice. Ajoute-en un ci-dessous.</div>`;
  document.querySelectorAll('#ex-list .ex-row').forEach(el=>el.onclick=()=>openExo(gid,el.dataset.e));
  show('view-group');
}

/* ============ EXERCICE + COURBE ============ */
let chart=null;
function openExo(gid,eid){
  cur.gid=gid; cur.eid=eid;
  const g=DB.groups.find(x=>x.id===gid), e=exoById(gid,eid);
  $('ex-title').textContent=e.name; $('ex-sub').textContent=g.name;
  $('log-desc').textContent=e.name+' · '+g.name;
  const pr=e.logs.reduce((m,l)=>Math.max(m,l.weight||0),0);
  $('ex-pr').textContent=pr?'PR '+pr+' kg':'PR —';
  const sorted=[...e.logs].sort((a,b)=>a.date<b.date?-1:1);
  drawChart(sorted,g.color);
  $('ex-history').innerHTML=sorted.length?[...sorted].reverse().map(l=>`
    <div class="log-item">
      ${l.photo?`<img src="${l.photo}">`:''}
      <div class="d">${fmtDate(l.date)}</div>
      <div class="v">${l.weight||0} kg ${l.reps?'× '+l.reps:''} ${l.sets>1?'· '+l.sets+' séries':''}</div>
      <span class="delete" data-i="${l.id}">Suppr</span></div>`).join('')
    :`<div class="empty" style="padding:24px">Pas encore de série.<br>Clique sur « Nouvelle série » 👆</div>`;
  document.querySelectorAll('#ex-history .delete').forEach(el=>el.onclick=()=>{
    e.logs=e.logs.filter(l=>l.id!=el.dataset.i); save(); openExo(gid,eid);
  });
  renderCoach('ex-coach', 'exo_'+eid);
  show('view-ex');
}
function drawChart(sorted,color){
  const ctx=$('chart'); if(chart)chart.destroy();
  if(!sorted.length){ chart=new Chart(ctx,{type:'line',data:{labels:['—'],datasets:[{data:[0]}]},options:{plugins:{legend:{display:false}},scales:{x:{display:false},y:{display:false}}}}); return; }
  chart=new Chart(ctx,{type:'line',
    data:{labels:sorted.map(l=>fmtDate(l.date)),datasets:[{data:sorted.map(l=>l.weight||0),borderColor:color,backgroundColor:color+'22',borderWidth:3,tension:.35,fill:true,pointBackgroundColor:color,pointRadius:4}]},
    options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.parsed.y+' kg'}}},
      scales:{x:{grid:{display:false},ticks:{color:'#9aa3b2',font:{size:11}}},y:{grid:{color:'#2b2f3a'},ticks:{color:'#9aa3b2',font:{size:11},callback:v=>v+'kg'}}}}});
}

/* ============ SHEETS ============ */
function openSheet(id){ $('sheet-bg').classList.add('show'); $(id).classList.add('show'); }
function closeSheets(){ if(typeof stopScan==='function') stopScan(); $('sheet-bg').classList.remove('show'); document.querySelectorAll('.sheet').forEach(s=>s.classList.remove('show')); }
$('sheet-bg').onclick=closeSheets;

function compress(file, cb){
  const r=new FileReader();
  r.onload=ev=>{ const img=new Image(); img.onload=()=>{
    const max=900,sc=Math.min(1,max/Math.max(img.width,img.height));
    const cv=document.createElement('canvas'); cv.width=img.width*sc; cv.height=img.height*sc;
    cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
    cb(cv.toDataURL('image/jpeg',0.7));
  }; img.src=ev.target.result; };
  r.readAsDataURL(file);
}

$('add-log').onclick=()=>{
  $('in-weight').value=''; $('in-reps').value=''; $('in-sets').value='1';
  $('in-date').value=todayISO(); pendingPhoto=null;
  $('photo-prev').style.display='none'; $('photo-label').textContent='Ajouter une photo';
  openSheet('sheet-log');
};
$('photo-pick').onclick=()=>$('in-photo').click();
$('in-photo').onchange=e=>{ const f=e.target.files[0]; if(!f)return; compress(f,d=>{ pendingPhoto=d; $('photo-prev').src=d; $('photo-prev').style.display='block'; $('photo-label').textContent='Photo ajoutée ✓'; }); };
$('save-log').onclick=()=>{
  const w=parseFloat($('in-weight').value)||0, reps=parseInt($('in-reps').value)||0;
  if(!w&&!reps){ alert('Indique au moins un poids ou des répétitions'); return; }
  const e=exoById(cur.gid,cur.eid);
  e.logs.push({id:nowTs(),date:$('in-date').value||todayISO(),weight:w,reps,sets:parseInt($('in-sets').value)||1,photo:pendingPhoto});
  if(pendingPhoto) DB.photos.push({id:nowTs(),date:$('in-date').value||todayISO(),img:pendingPhoto,note:e.name+' · '+w+'kg'});
  save(); closeSheets(); openExo(cur.gid,cur.eid);
};

$('add-ex').onclick=()=>{ $('in-exname').value=''; openSheet('sheet-ex'); };
$('save-ex').onclick=()=>{ const n=$('in-exname').value.trim(); if(!n)return; DB.exos[cur.gid].push({id:cur.gid+'_'+nowTs(),name:n,logs:[]}); save(); closeSheets(); openGroup(cur.gid); };

/* ============ CARDIO + GPS ============ */
let selAct='Course', gps={watch:null,pts:[],dist:0,t0:0,timer:null,map:null,line:null,marker:null};

document.querySelectorAll('#act-pick .ap').forEach(el=>el.onclick=()=>{
  document.querySelectorAll('#act-pick .ap').forEach(x=>x.classList.remove('on'));
  el.classList.add('on'); selAct=el.dataset.act;
});

function renderCardio(){
  renderStrava();
  $('cardio-history').innerHTML=DB.cardio.length?[...DB.cardio].reverse().map(c=>`
    <div class="ex-row" data-c="${c.id}">
      <div class="ex-thumb"><svg viewBox="0 0 24 24"><path d="M3 18l5-9 4 5 3-7 6 11"/></svg></div>
      <div class="ex-info"><div class="t">${c.act}</div><div class="s">${fmtDate(c.date)} · ${fmtTime(c.dur)}</div></div>
      <div class="ex-info" style="flex:0;text-align:right"><div class="pr">${c.dist.toFixed(2)} km</div></div>
      <svg class="chev" style="width:20px;height:20px;stroke:currentColor;stroke-width:2;fill:none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></div>`).join('')
    :`<div class="empty"><svg viewBox="0 0 24 24"><path d="M3 18l5-9 4 5 3-7 6 11"/></svg><div>Aucune sortie enregistrée.<br>Choisis une activité et démarre !</div></div>`;
  document.querySelectorAll('#cardio-history .ex-row').forEach(el=>el.onclick=()=>openCardioDetail(el.dataset.c));
}

function haversine(a,b){
  const R=6371,dLat=(b[0]-a[0])*Math.PI/180,dLon=(b[1]-a[1])*Math.PI/180;
  const x=Math.sin(dLat/2)**2+Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}

$('start-gps').onclick=()=>{
  if(!navigator.geolocation){ alert('GPS non disponible sur cet appareil.'); return; }
  show('view-live'); $('live-act').textContent=selAct;
  gps={watch:null,pts:[],dist:0,t0:Date.now(),timer:null,map:null,line:null,marker:null};
  $('live-dist').textContent='0.00'; $('live-time').textContent='00:00'; $('live-pace').textContent='—'; $('live-speed').textContent='0.0';
  setTimeout(()=>{
    gps.map=L.map('map',{zoomControl:false,attributionControl:false}).setView([48.8566,2.3522],15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(gps.map);
    gps.line=L.polyline([],{color:'#22c55e',weight:5}).addTo(gps.map);
  },100);
  gps.timer=setInterval(()=>{
    const sec=Math.floor((Date.now()-gps.t0)/1000);
    $('live-time').textContent=fmtTime(sec);
    if(gps.dist>0){ const pace=sec/60/gps.dist; $('live-pace').textContent=fmtTime(Math.round(pace*60)); $('live-speed').textContent=(gps.dist/(sec/3600)).toFixed(1); }
  },1000);
  gps.watch=navigator.geolocation.watchPosition(pos=>{
    const p=[pos.coords.latitude,pos.coords.longitude];
    $('live-status').textContent='Enregistrement en cours…';
    if(gps.pts.length) gps.dist+=haversine(gps.pts[gps.pts.length-1],p);
    gps.pts.push(p); $('live-dist').textContent=gps.dist.toFixed(2);
    if(gps.map){ gps.line.addLatLng(p); gps.map.setView(p,16);
      if(!gps.marker) gps.marker=L.circleMarker(p,{radius:7,color:'#fff',fillColor:'#22c55e',fillOpacity:1,weight:3}).addTo(gps.map);
      else gps.marker.setLatLng(p);
    }
  },err=>{ $('live-status').textContent='GPS refusé ou indisponible'; },{enableHighAccuracy:true,maximumAge:1000,timeout:8000});
};

function stopGps(savIt){
  if(gps.watch!=null) navigator.geolocation.clearWatch(gps.watch);
  if(gps.timer) clearInterval(gps.timer);
  if(gps.map){ gps.map.remove(); gps.map=null; }
  if(savIt){
    const dur=Math.floor((Date.now()-gps.t0)/1000);
    DB.cardio.push({id:nowTs(),act:selAct,date:todayISO(),dur,dist:gps.dist,pts:gps.pts});
    save();
  }
  navView('cardio');
}
$('stop-gps').onclick=()=>{ if(gps.dist<0.01 && !confirm('Distance quasi nulle. Enregistrer quand même ?')) return; stopGps(true); };
$('cancel-gps').onclick=()=>{ if(confirm('Annuler la séance ?')) stopGps(false); };

let detailMap=null;
function openCardioDetail(id){
  const c=DB.cardio.find(x=>x.id==id); if(!c)return;
  $('cd-act').textContent=c.act; $('cd-date').textContent=fmtFull(c.date);
  $('cd-dist').textContent=c.dist.toFixed(2); $('cd-time').textContent=fmtTime(c.dur);
  $('cd-pace').textContent=c.dist>0?fmtTime(Math.round((c.dur/60/c.dist)*60)):'—';
  show('view-cardio-detail');
  setTimeout(()=>{
    if(detailMap){ detailMap.remove(); detailMap=null; }
    detailMap=L.map('cd-map',{zoomControl:false,attributionControl:false});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(detailMap);
    if(c.pts&&c.pts.length>1){ const line=L.polyline(c.pts,{color:'#d4537e',weight:5}).addTo(detailMap); detailMap.fitBounds(line.getBounds(),{padding:[20,20]});
      L.circleMarker(c.pts[0],{radius:6,color:'#fff',fillColor:'#22c55e',fillOpacity:1}).addTo(detailMap);
      L.circleMarker(c.pts[c.pts.length-1],{radius:6,color:'#fff',fillColor:'#ef4444',fillOpacity:1}).addTo(detailMap);
    } else { detailMap.setView([48.8566,2.3522],12); }
  },100);
  $('cd-delete').onclick=()=>{ if(confirm('Supprimer cette sortie ?')){ DB.cardio=DB.cardio.filter(x=>x.id!=id); save(); navView('cardio'); } };
}

/* ============ PHOTOS ÉVOLUTION ============ */
function renderPhotos(){
  const ps=[...DB.photos].sort((a,b)=>b.date<a.date?-1:1);
  $('photos-grid').innerHTML=ps.length?`<div class="photo-grid">`+ps.map(p=>`
    <div class="pg" data-i="${p.id}"><img src="${p.img}"><div class="cap">${fmtDate(p.date)}</div></div>`).join('')+`</div>`
    :`<div class="empty"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/></svg><div>Aucune photo encore.<br>Ajoute des photos pour suivre ton évolution physique 📸</div></div>`;
  document.querySelectorAll('#photos-grid .pg').forEach(el=>el.onclick=()=>{
    const p=DB.photos.find(x=>x.id==el.dataset.i);
    if(confirm((p.note?p.note+'\n':'')+fmtFull(p.date)+'\n\nSupprimer cette photo ?')){ DB.photos=DB.photos.filter(x=>x.id!=el.dataset.i); save(); renderPhotos(); }
  });
}
$('add-progress-photo').onclick=()=>{ pendingProgress=null; $('pp-prev').style.display='none'; $('pp-label').textContent='Choisir une photo'; $('pp-note').value=''; openSheet('sheet-photo'); };
$('pp-pick').onclick=()=>$('pp-photo').click();
$('pp-photo').onchange=e=>{ const f=e.target.files[0]; if(!f)return; compress(f,d=>{ pendingProgress=d; $('pp-prev').src=d; $('pp-prev').style.display='block'; $('pp-label').textContent='Photo prête ✓'; }); };
$('pp-save').onclick=()=>{ if(!pendingProgress){ alert('Choisis une photo'); return; } DB.photos.push({id:nowTs(),date:todayISO(),img:pendingProgress,note:$('pp-note').value.trim()}); save(); closeSheets(); renderPhotos(); };

/* ============ BIEN-ÊTRE ============ */
function renderWellness(){
  const stretchSvg='<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><path d="M12 8v6m0 0l-4 6m4-6l4 6M7 11h10"/></svg>';
  $('tab-stretch').innerHTML=`
    <div class="section-title" style="margin-top:2px">🎯 Objectifs souplesse</div>
    <div class="groups">${FLEX_GOALS.map(g=>`
      <div class="group" data-goal="${g.id}"><div class="dot" style="background:${g.color}">${stretchSvg}</div>
        <div><div class="name" style="font-size:13px">${g.name}</div></div></div>`).join('')}</div>
    <div class="section-title">🧍 Par zone du corps</div>
    <div class="groups">${STRETCH_ZONES.map(z=>`
      <div class="group" data-zone="${z.id}"><div class="dot" style="background:${z.color}">${stretchSvg}</div>
        <div><div class="name" style="font-size:14px">${z.name}</div><div class="count">${z.keys.length} étirements</div></div></div>`).join('')}</div>
    <div class="section-title">⚡ Routines express</div>
    ${STRETCH_ROUTINES.map(r=>{const tot=r.steps.reduce((s,x)=>s+x.sec,0);
      return `<div class="routine" data-s="${r.id}"><div class="rt"><span>${r.name}</span><div class="ico" style="background:${r.color}">${stretchSvg}</div></div>
      <div class="rs">${r.steps.length} étirements · ${Math.round(tot/60)} min</div></div>`;}).join('')}`;
  document.querySelectorAll('#tab-stretch .routine').forEach(el=>el.onclick=()=>openStretchRoutine(STRETCH_ROUTINES.find(r=>r.id===el.dataset.s)));
  document.querySelectorAll('#tab-stretch [data-zone]').forEach(el=>el.onclick=()=>openStretchList('zone',el.dataset.zone));
  document.querySelectorAll('#tab-stretch [data-goal]').forEach(el=>el.onclick=()=>openStretchList('goal',el.dataset.goal));

  $('tab-beauty').innerHTML=BEAUTY_ROUTINES.map(r=>{
    const done=(DB.beauty[r.id]||[]).length;
    return `<div class="routine" data-b="${r.id}">
      <div class="rt"><span>${r.name}</span><div class="ico" style="background:${r.color}"><svg viewBox="0 0 24 24">${BEAUTY_ICONS[r.icon]}</svg></div></div>
      <div class="rs">${r.steps.length} étapes${done?' · '+done+' fait(s) aujourd\'hui':''}</div></div>`;
  }).join('');
  document.querySelectorAll('#tab-beauty .routine').forEach(el=>el.onclick=()=>openRoutine(el.dataset.b));

  const rm=DB.reminders;
  $('tab-remind').innerHTML=`
    <div class="card">
      <div class="reminder-row"><div><div style="font-weight:500">Étirements</div><div style="font-size:13px;color:var(--muted)"><input type="time" value="${rm.stretch.time}" id="rm-stretch-t" style="display:inline;width:auto;padding:4px 8px;font-size:13px;margin-top:4px"></div></div><div class="switch ${rm.stretch.on?'on':''}" data-r="stretch"></div></div>
      <div class="reminder-row"><div><div style="font-weight:500">Routine soin matin</div><div style="font-size:13px;color:var(--muted)"><input type="time" value="${rm.beauty_m.time}" id="rm-bm-t" style="display:inline;width:auto;padding:4px 8px;font-size:13px;margin-top:4px"></div></div><div class="switch ${rm.beauty_m.on?'on':''}" data-r="beauty_m"></div></div>
      <div class="reminder-row"><div><div style="font-weight:500">Routine soin soir</div><div style="font-size:13px;color:var(--muted)"><input type="time" value="${rm.beauty_s.time}" id="rm-bs-t" style="display:inline;width:auto;padding:4px 8px;font-size:13px;margin-top:4px"></div></div><div class="switch ${rm.beauty_s.on?'on':''}" data-r="beauty_s"></div></div>
    </div>
    <p style="font-size:13px;color:var(--muted);line-height:1.6;padding:0 4px">🔔 Active un rappel pour être notifié à l'heure choisie. Sur iPhone, ajoute d'abord l'app à l'écran d'accueil pour autoriser les notifications.</p>`;
  document.querySelectorAll('#tab-remind .switch').forEach(el=>el.onclick=()=>toggleReminder(el.dataset.r,el));
  $('rm-stretch-t').onchange=e=>{ rm.stretch.time=e.target.value; save(); scheduleAll(); };
  $('rm-bm-t').onchange=e=>{ rm.beauty_m.time=e.target.value; save(); scheduleAll(); };
  $('rm-bs-t').onchange=e=>{ rm.beauty_s.time=e.target.value; save(); scheduleAll(); };
}

document.querySelectorAll('#well-tabs .tab').forEach(el=>el.onclick=()=>{
  document.querySelectorAll('#well-tabs .tab').forEach(x=>x.classList.remove('on')); el.classList.add('on');
  ['stretch','beauty','remind'].forEach(t=>$('tab-'+t).classList.toggle('hide',t!==el.dataset.tab));
});

/* ---- routine soin (checklist) ---- */
let curRoutine=null;
function openRoutine(id){
  curRoutine=BEAUTY_ROUTINES.find(r=>r.id===id);
  $('rt-title').textContent=curRoutine.name; $('rt-sub').textContent="Coche au fur et à mesure";
  renderRoutineSteps();
  show('view-routine');
}
function renderRoutineSteps(){
  const done=DB.beauty[curRoutine.id]||[];
  $('rt-steps').innerHTML=curRoutine.steps.map((s,i)=>`
    <div class="check-step ${done.includes(i)?'done':''}" data-i="${i}">
      <div class="cb"><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 6"/></svg></div>
      <div class="ct">${s}</div></div>`).join('');
  document.querySelectorAll('#rt-steps .check-step').forEach(el=>el.onclick=()=>{
    const i=+el.dataset.i; let d=DB.beauty[curRoutine.id]||[];
    d=d.includes(i)?d.filter(x=>x!==i):[...d,i]; DB.beauty[curRoutine.id]=d; save(); renderRoutineSteps();
  });
}
$('rt-reset').onclick=()=>{ DB.beauty[curRoutine.id]=[]; save(); renderRoutineSteps(); };

/* ---- liste d'étirements (zone / objectif) ---- */
let curSList=null;
function stretchesOf(kind,id){
  if(kind==='zone'){ const z=STRETCH_ZONES.find(x=>x.id===id); return {title:z.name, sub:z.keys.length+' étirements', color:z.color, items:z.keys.map(k=>({key:k,...S[k]}))}; }
  const g=FLEX_GOALS.find(x=>x.id===id); return {title:g.name, sub:g.desc, color:g.color, items:g.keys.map(k=>({key:k,...S[k]}))};
}
function openStretchList(kind,id){ curSList=stretchesOf(kind,id); renderSList(); show('view-slist'); }
function renderSList(){
  $('slist-title').textContent=curSList.title; $('slist-sub').textContent=curSList.sub;
  $('slist-content').innerHTML=curSList.items.map((s,i)=>`
    <div class="ex-row" data-i="${i}">
      <div class="ex-thumb" style="padding:2px">${bodyMap(s.target,curSList.color)}</div>
      <div class="ex-info"><div class="t">${s.name}</div><div class="s">${s.level} · ${s.sec}s</div></div>
      <svg class="chev" style="width:20px;height:20px;stroke:currentColor;stroke-width:2;fill:none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></div>`).join('');
  document.querySelectorAll('#slist-content .ex-row').forEach(el=>el.onclick=()=>openStretchDetail(curSList.items[+el.dataset.i],true));
}
$('slist-runall').onclick=()=>openStretchRoutine({name:curSList.title,color:curSList.color,steps:curSList.items.map(s=>({name:s.name,sec:s.sec}))});

/* ---- détail d'un étirement (schéma + instructions + photo perso) ---- */
let curStretch=null;
const zoneName={nuque:'Nuque',epaules:'Épaules',pecs:'Poitrine',triceps:'Triceps',avantbras:'Avant-bras',dos:'Dos / colonne',obliques:'Obliques',fessiers:'Fessiers',hanches:'Hanches',quadriceps:'Quadriceps',ischios:'Ischio-jambiers',adducteurs:'Adducteurs',mollets:'Mollets',chevilles:'Chevilles',corps:'Corps entier'};
function openStretchDetail(s,fromList){
  curStretch=s; curStretch._fromList=fromList;
  $('sd-title').textContent=s.name; $('sd-sub').textContent=s.level+' · '+s.sec+' secondes';
  $('sd-body').innerHTML=bodyMap(s.target, (curSList&&curSList.color)||'#3b82f6');
  $('sd-target').textContent=zoneName[s.target]||'Corps';
  $('sd-steps').innerHTML=s.steps.map((st,i)=>`<div style="display:flex;gap:12px;padding:8px 0;${i<s.steps.length-1?'border-bottom:1px solid var(--line)':''}"><span style="color:var(--accent);font-weight:700;flex-shrink:0">${i+1}</span><span style="font-size:15px">${st}</span></div>`).join('')+(s.tips?`<div style="margin-top:12px;font-size:13px;color:var(--muted);line-height:1.5">💡 ${s.tips}</div>`:'');
  renderStretchPhoto();
  renderCoach('sd-coach', s.key);
  show('view-stretch-detail');
}
function renderStretchPhoto(){
  const ph=(DB.stretchPhotos||{})[curStretch.key];
  $('sd-photo-wrap').innerHTML=ph?`<img src="${ph}" style="width:100%;max-height:120px;object-fit:cover;border-radius:10px">`:'';
  $('sd-addphoto').textContent='';
  $('sd-addphoto').innerHTML=(ph?'<svg style="width:20px;height:20px;stroke:currentColor;stroke-width:2;fill:none" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg> Retirer ma photo':'<svg style="width:20px;height:20px;stroke:currentColor;stroke-width:2;fill:none" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/></svg> Ajouter ma photo de la position');
}
$('sd-back').onclick=()=>{ if(curStretch&&curStretch._fromList) show('view-slist'); else navView('wellness'); };
$('sd-start').onclick=()=>openStretchRoutine({name:curStretch.name,steps:[{name:curStretch.name,sec:curStretch.sec}]});
$('sd-addphoto').onclick=()=>{
  DB.stretchPhotos=DB.stretchPhotos||{};
  if(DB.stretchPhotos[curStretch.key]){ delete DB.stretchPhotos[curStretch.key]; save(); renderStretchPhoto(); }
  else $('sd-photo-input').click();
};
$('sd-photo-input').onchange=e=>{ const f=e.target.files[0]; if(!f)return; compress(f,d=>{ DB.stretchPhotos=DB.stretchPhotos||{}; DB.stretchPhotos[curStretch.key]=d; save(); renderStretchPhoto(); }); };

/* ---- mode coach (vidéo de démo + notes, ajoutés par l'utilisateur) ---- */
function videoEmbed(url){
  if(!url) return null;
  let m=url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  if(m) return 'https://www.youtube.com/embed/'+m[1];
  m=url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if(m) return 'https://player.vimeo.com/video/'+m[1];
  return null;
}
function renderCoach(containerId,key){
  const c=$(containerId); if(!c) return;
  DB.coach=DB.coach||{vid:{},note:{}};
  const url=DB.coach.vid[key], note=DB.coach.note[key], emb=videoEmbed(url);
  c.innerHTML=`<div class="section-title">🎥 Coach</div>
    <div class="card">
      ${url?(emb?`<div style="position:relative;padding-bottom:56%;height:0;border-radius:10px;overflow:hidden;margin-bottom:10px"><iframe src="${emb}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe></div>`
        :`<button class="btn sec" id="${containerId}-play" style="margin-bottom:10px">▶ Voir la vidéo de démo</button>`):''}
      ${note?`<div style="font-size:14px;line-height:1.5;white-space:pre-wrap;margin-bottom:10px">${note.replace(/[<>]/g,'')}</div>`:''}
      <div style="display:flex;gap:8px">
        <button class="btn ghost" id="${containerId}-vid" style="flex:1;font-size:13px;padding:10px">${url?'Modifier la vidéo':'+ Vidéo démo'}</button>
        <button class="btn ghost" id="${containerId}-note" style="flex:1;font-size:13px;padding:10px">${note?'Modifier les notes':'+ Notes coach'}</button>
      </div>
    </div>`;
  const play=$(containerId+'-play'); if(play) play.onclick=()=>window.open(url,'_blank');
  $(containerId+'-vid').onclick=()=>{ const v=prompt('Lien de la vidéo de démo (YouTube ou Vimeo) :', url||''); if(v!==null){ if(v.trim()) DB.coach.vid[key]=v.trim(); else delete DB.coach.vid[key]; save(); renderCoach(containerId,key); } };
  $(containerId+'-note').onclick=()=>{ const t=prompt('Notes / conseils du coach :', note||''); if(t!==null){ if(t.trim()) DB.coach.note[key]=t.trim(); else delete DB.coach.note[key]; save(); renderCoach(containerId,key); } };
}

/* ---- lecteur d'étirements (timer) ---- */
let sp={routine:null,idx:0,left:0,timer:null,running:false};
function openStretchRoutine(routine){
  sp.routine=routine; sp.idx=0; sp.running=false;
  if(sp.timer) clearInterval(sp.timer);
  $('sp-title').textContent=routine.name;
  $('sp-sub').textContent=routine.steps.length+(routine.steps.length>1?' étirements':' étirement');
  loadStretchStep(); $('sp-toggle').textContent='Démarrer';
  show('view-stretch-play');
}
function loadStretchStep(){
  const st=sp.routine.steps[sp.idx]; sp.left=st.sec;
  $('sp-name').textContent=st.name; $('sp-timer').textContent=String(st.sec).padStart(2,'0');
  const nx=sp.routine.steps[sp.idx+1];
  $('sp-next').textContent=nx?'Ensuite : '+nx.name:'Dernier étirement 💪';
  $('sp-dots').innerHTML=sp.routine.steps.map((_,i)=>`<div class="pd ${i<sp.idx?'done':i===sp.idx?'on':''}"></div>`).join('');
}
function tickStretch(){
  sp.left--; $('sp-timer').textContent=String(Math.max(0,sp.left)).padStart(2,'0');
  if(sp.left<=0){
    if(navigator.vibrate) navigator.vibrate(200);
    if(sp.idx<sp.routine.steps.length-1){ sp.idx++; loadStretchStep(); }
    else { clearInterval(sp.timer); sp.running=false; $('sp-name').textContent='Terminé ! 🎉'; $('sp-timer').textContent='✓'; $('sp-next').textContent='Bien joué, séance d\'étirements complète.'; $('sp-toggle').textContent='Recommencer'; sp.idx=0; }
  }
}
$('sp-toggle').onclick=()=>{
  if($('sp-toggle').textContent==='Recommencer'){ openStretchRoutine(sp.routine); return; }
  sp.running=!sp.running;
  if(sp.running){ $('sp-toggle').textContent='Pause'; sp.timer=setInterval(tickStretch,1000); }
  else { $('sp-toggle').textContent='Reprendre'; clearInterval(sp.timer); }
};
$('sp-skip').onclick=()=>{
  if(sp.idx<sp.routine.steps.length-1){ sp.idx++; loadStretchStep(); }
};

/* ============ RAPPELS / NOTIFICATIONS ============ */
let scheduled=[];
function toggleReminder(key,el){
  const r=DB.reminders[key];
  if(!r.on){
    if('Notification' in window && Notification.permission!=='granted'){
      Notification.requestPermission().then(p=>{ if(p==='granted'){ r.on=true; el.classList.add('on'); save(); scheduleAll(); } else alert('Autorise les notifications dans les réglages pour activer les rappels.'); });
      return;
    }
    r.on=true; el.classList.add('on');
  } else { r.on=false; el.classList.remove('on'); }
  save(); scheduleAll();
}
function scheduleAll(){
  scheduled.forEach(t=>clearTimeout(t)); scheduled=[];
  const labels={stretch:'🧘 C\'est l\'heure de tes étirements !',beauty_m:'☀️ Routine soin du matin',beauty_s:'🌙 Routine soin du soir'};
  Object.entries(DB.reminders).forEach(([k,r])=>{
    if(!r.on)return;
    const [h,m]=r.time.split(':').map(Number);
    const now=new Date(); const t=new Date(); t.setHours(h,m,0,0);
    if(t<=now) t.setDate(t.getDate()+1);
    const ms=t-now;
    if(ms<24*3600*1000) scheduled.push(setTimeout(()=>{ notify(labels[k]); },ms));
  });
}
function notify(msg){
  if('Notification' in window && Notification.permission==='granted') new Notification('MonSport',{body:msg,icon:'icon.svg'});
  scheduleAll();
}

/* ============ STRAVA ============ */
const STRAVA_CLIENT_ID='259892';
const STRAVA_FN='/.netlify/functions/strava';
const STRAVA_TYPES={Run:'Course',TrailRun:'Trail',Ride:'Vélo',VirtualRide:'Vélo virtuel',
  MountainBikeRide:'VTT',Walk:'Marche',Hike:'Randonnée',Swim:'Natation',WeightTraining:'Muscu',
  Workout:'Renforcement',Elliptical:'Elliptique',Rowing:'Rameur',Yoga:'Yoga',Crossfit:'Crossfit'};
const stravaType=t=>STRAVA_TYPES[t]||t;

async function stravaApi(payload){
  const r=await fetch(STRAVA_FN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  let data; try{ data=await r.json(); }catch(e){ data={error:'Réponse serveur invalide'}; }
  if(!r.ok && !data.error) data.error='Erreur '+r.status;
  return data;
}
function stravaConnect(){
  const uri=location.origin+'/';
  location.href='https://www.strava.com/oauth/authorize?client_id='+STRAVA_CLIENT_ID+
    '&response_type=code&redirect_uri='+encodeURIComponent(uri)+
    '&approval_prompt=auto&scope=read,activity:read_all';
}
async function handleStravaCallback(){
  const p=new URLSearchParams(location.search);
  const code=p.get('code');
  if(p.get('error')){ history.replaceState({},'',location.pathname); return false; }
  if(!code) return false;
  const data=await stravaApi({action:'exchange',code});
  if(data && data.access_token){
    DB.strava={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:data.expires_at,athlete:data.athlete||null,activities:[]};
    save();
  } else {
    alert('Connexion Strava échouée : '+(data.error||'inconnue')+'\n\n(As-tu bien ajouté la variable STRAVA_CLIENT_SECRET dans Netlify ?)');
  }
  history.replaceState({},'',location.pathname);
  return true;
}
async function stravaEnsureToken(){
  if(!DB.strava) return null;
  const now=Math.floor(Date.now()/1000);
  if(DB.strava.expires_at && DB.strava.expires_at-60<now){
    const data=await stravaApi({action:'refresh',refresh_token:DB.strava.refresh_token});
    if(data && data.access_token){ DB.strava.access_token=data.access_token; DB.strava.refresh_token=data.refresh_token; DB.strava.expires_at=data.expires_at; save(); }
    else return null;
  }
  return DB.strava.access_token;
}
async function stravaSync(){
  const box=$('strava-box'); if(box) box.querySelector('#strava-sync')&&(box.querySelector('#strava-sync').textContent='Synchronisation…');
  const token=await stravaEnsureToken();
  if(!token){ alert('Reconnecte ton compte Strava.'); return; }
  const acts=await stravaApi({action:'activities',access_token:token,per_page:30});
  if(Array.isArray(acts)){
    DB.strava.activities=acts.map(a=>({id:a.id,name:a.name,type:a.type,dist:(a.distance||0)/1000,dur:a.moving_time||0,date:a.start_date_local,kcal:Math.round(a.calories||0),elev:Math.round(a.total_elevation_gain||0)}));
    save();
  } else { alert('Erreur Strava : '+(acts.error||'récupération impossible')); }
  renderStrava();
}
function stravaDisconnect(){ if(confirm('Déconnecter Strava ?')){ DB.strava=null; save(); renderStrava(); } }

function renderStrava(){
  const box=$('strava-box'); if(!box) return;
  if(!DB.strava){
    box.innerHTML=`<button class="btn" id="strava-connect" style="background:#fc4c02">
      <svg style="width:20px;height:20px;fill:#fff" viewBox="0 0 24 24"><path d="M15.4 17.8 13.2 13.5 11 17.8H7.6L13.2 7l5.6 10.8h-3.4Z"/></svg>
      Connecter mon compte Strava</button>
      <p style="font-size:12px;color:var(--muted);text-align:center;margin:8px 0 16px">Importe automatiquement tes courses et sorties vélo Strava.</p>`;
    $('strava-connect').onclick=stravaConnect;
    return;
  }
  const ath=DB.strava.athlete;
  const name=ath?((ath.firstname||'')+' '+(ath.lastname||'')).trim():'Mon compte';
  const acts=DB.strava.activities||[];
  box.innerHTML=`
    <div class="card" style="border:1px solid #fc4c02">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="width:36px;height:36px;border-radius:10px;background:#fc4c02;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg style="width:20px;height:20px;fill:#fff" viewBox="0 0 24 24"><path d="M15.4 17.8 13.2 13.5 11 17.8H7.6L13.2 7l5.6 10.8h-3.4Z"/></svg></div>
        <div style="flex:1"><div style="font-weight:600;font-size:15px">Strava connecté</div><div style="font-size:12px;color:var(--muted)">${name}</div></div>
        <span class="delete" id="strava-disc">Déconnecter</span>
      </div>
      <button class="btn sec" id="strava-sync"><svg style="width:18px;height:18px;stroke:currentColor;stroke-width:2;fill:none" viewBox="0 0 24 24"><path d="M20 11a8 8 0 10-2 5m2 3v-6h-6"/></svg> Synchroniser mes activités</button>
    </div>
    ${acts.length?`<div class="section-title">Activités Strava</div>`+acts.slice(0,20).map(a=>`
      <div class="ex-row" style="cursor:default">
        <div class="ex-thumb" style="background:#fc4c02"><svg style="width:20px;height:20px;fill:#fff" viewBox="0 0 24 24"><path d="M15.4 17.8 13.2 13.5 11 17.8H7.6L13.2 7l5.6 10.8h-3.4Z"/></svg></div>
        <div class="ex-info"><div class="t">${a.name||stravaType(a.type)}</div><div class="s">${stravaType(a.type)} · ${fmtDate(a.date)}${a.dur?' · '+fmtTime(a.dur):''}</div></div>
        <div class="ex-info" style="flex:0;text-align:right"><div class="pr">${a.dist?a.dist.toFixed(1)+' km':(a.kcal?a.kcal+' kcal':'')}</div></div>
      </div>`).join(''):`<p style="font-size:13px;color:var(--muted);text-align:center;padding:4px 0 16px">Clique sur « Synchroniser » pour charger tes activités.</p>`}`;
  $('strava-disc').onclick=stravaDisconnect;
  $('strava-sync').onclick=stravaSync;
}

/* ============ SANTÉ (import Apple Santé) ============ */
let healthCharts=[];
$('import-health').onclick=()=>$('health-file').click();
$('health-file').onchange=async e=>{
  const f=e.target.files[0]; if(!f) return;
  $('health-status').textContent='Lecture du fichier… (ça peut prendre 1-2 min)';
  try{
    let xml='';
    if(f.name.toLowerCase().endsWith('.zip')){
      const zip=await JSZip.loadAsync(f);
      let entry=null;
      zip.forEach((p,o)=>{ if(p.toLowerCase().endsWith('export.xml')) entry=o; });
      if(!entry){ $('health-status').textContent='❌ Fichier export.xml introuvable dans le zip.'; return; }
      xml=await entry.async('string');
    } else {
      xml=await f.text();
    }
    const data=parseHealth(xml);
    if(!data.sleep.length && !data.steps.length && !data.workouts.length && !data.hr.length){
      $('health-status').textContent='⚠️ Aucune donnée reconnue. Vérifie que c\'est bien l\'export Apple Santé.'; return;
    }
    DB.health={ imported:todayISO(), ...data };
    save(); $('health-status').textContent='✅ Importé le '+fmtDate(todayISO());
    renderHealth();
  }catch(err){ $('health-status').textContent='❌ Erreur de lecture : '+err.message; }
};

const WORKOUT_NAMES={Running:'Course',Walking:'Marche',Cycling:'Vélo',Swimming:'Natation',
  FunctionalStrengthTraining:'Renforcement',TraditionalStrengthTraining:'Musculation',
  HighIntensityIntervalTraining:'HIIT',Yoga:'Yoga',CoreTraining:'Gainage',Elliptical:'Elliptique',
  Rowing:'Rameur',Hiking:'Randonnée',Pilates:'Pilates',Dance:'Danse',Boxing:'Boxe',
  StairClimbing:'Escaliers',Cooldown:'Récupération',Other:'Autre'};
function workoutName(a){ return WORKOUT_NAMES[a]||a||'Séance'; }
function toISO(d){ return d.slice(0,10); }
function parseDateTime(s){
  // Apple : "2026-06-18 07:30:00 +0200" → "2026-06-18T07:30:00+02:00" (Safari exige le ':' dans le fuseau)
  if(!s) return new Date(NaN);
  const m=s.match(/(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})\s*([+-]\d{2}):?(\d{2})/);
  if(m) return new Date(m[1]+'T'+m[2]+m[3]+':'+m[4]);
  return new Date(s.replace(' ','T'));
}

function sleepScore(s){
  const total=s.asleep; if(total<=0) return 0;
  const sDur=Math.max(0,Math.min(1,(total/60)/8));            // 8 h = idéal
  const deepRem=(s.deep+s.rem)/total;
  const sQual=Math.max(0,Math.min(1,deepRem/0.45));           // ~45 % profond+paradoxal = idéal
  const awakePen=Math.min(1,s.awake/60);                      // >1 h éveillé pénalise
  return Math.max(0,Math.min(100,Math.round(sDur*60+sQual*32-awakePen*8+8)));
}
function fmtMin(m){ m=Math.round(m); const h=Math.floor(m/60), mm=m%60; return h?(h+' h'+(mm?' '+(mm<10?'0':'')+mm:'')):(mm+' min'); }

const KEEP_DAYS=185;   // ~6 mois d'historique
function fmtClock(raw){ return (raw||'').substr(11,5); }   // "...DD HH:MM:SS" -> "HH:MM"

function parseHealth(xml){
  const steps={}, stages={}, hrByDay={}, restByDay={}, energy={}, exo={}, hrvByDay={}, weight={}, workouts=[], segs=[];
  let vo2={date:'',val:0};
  const lines=xml.split('\n');
  for(let i=0;i<lines.length;i++){
    const ln=lines[i];
    if(ln.indexOf('<Record')===-1 && ln.indexOf('<Workout')===-1) continue;
    if(ln.indexOf('<Workout')>-1){
      const sd0=(ln.match(/startDate="([^"]+)"/)||[])[1];
      const act=(ln.match(/workoutActivityType="([^"]+)"/)||[])[1]||'';
      const dur=parseFloat((ln.match(/duration="([^"]+)"/)||[])[1])||0;
      const dist=parseFloat((ln.match(/totalDistance="([^"]+)"/)||[])[1])||0;
      const kcal=parseFloat((ln.match(/totalEnergyBurned="([^"]+)"/)||[])[1])||0;
      if(sd0) workouts.push({act:act.replace('HKWorkoutActivityType',''), date:toISO(sd0), dur:Math.round(dur), dist, kcal:Math.round(kcal)});
      continue;
    }
    const type=(ln.match(/type="([^"]+)"/)||[])[1];
    const sd=(ln.match(/startDate="([^"]+)"/)||[])[1];
    const ed=(ln.match(/endDate="([^"]+)"/)||[])[1];
    const val=(ln.match(/ value="([^"]+)"/)||[])[1];
    if(!type||!sd) continue;
    const day=toISO(sd);
    switch(type){
      case 'HKQuantityTypeIdentifierStepCount': steps[day]=(steps[day]||0)+(parseFloat(val)||0); break;
      case 'HKCategoryTypeIdentifierSleepAnalysis': {
        if(!ed||!val||/InBed/i.test(val)) break;
        const t0=parseDateTime(sd), t1=parseDateTime(ed);
        const mins=(t1-t0)/60000;
        if(!(mins>0&&mins<16*60)) break;
        let stg=null;
        if(/Awake/i.test(val)) stg='awake';
        else if(/AsleepREM/i.test(val)) stg='rem';
        else if(/AsleepDeep/i.test(val)) stg='deep';
        else if(/AsleepCore/i.test(val)) stg='core';
        else if(/Asleep/i.test(val)) stg='core';        // Unspecified/ancien format → léger
        if(!stg) break;
        const night=toISO(ed);                            // rattaché au jour de réveil
        const s=stages[night]=stages[night]||{awake:0,rem:0,core:0,deep:0,asleep:0};
        s[stg]+=mins; if(stg!=='awake') s.asleep+=mins;
        segs.push({night,stage:stg,ms:t0.getTime(),dur:mins,raw:sd});
        break;
      }
      case 'HKQuantityTypeIdentifierHeartRate': { const v=parseFloat(val); if(v){ (hrByDay[day]=hrByDay[day]||[]).push(v); } break; }
      case 'HKQuantityTypeIdentifierRestingHeartRate': { const v=parseFloat(val); if(v) restByDay[day]=v; break; }
      case 'HKQuantityTypeIdentifierActiveEnergyBurned': energy[day]=(energy[day]||0)+(parseFloat(val)||0); break;
      case 'HKQuantityTypeIdentifierAppleExerciseTime': exo[day]=(exo[day]||0)+(parseFloat(val)||0); break;
      case 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN': { const v=parseFloat(val); if(v){ (hrvByDay[day]=hrvByDay[day]||[]).push(v); } break; }
      case 'HKQuantityTypeIdentifierBodyMass': { const v=parseFloat(val); if(v) weight[day]=v; break; }
      case 'HKQuantityTypeIdentifierVO2Max': { const v=parseFloat(val); if(v && day>=vo2.date) vo2={date:day,val:v}; break; }
    }
  }
  const keep=o=>Object.entries(o).sort((a,b)=>a[0]<b[0]?-1:1).slice(-KEEP_DAYS);
  const avgDay=o=>keep(Object.fromEntries(Object.entries(o).map(([d,a])=>[d,Math.round(a.reduce((s,x)=>s+x,0)/a.length)])));
  // hypnogramme de la dernière nuit
  const nights=Object.keys(stages).sort();
  let hypno=null;
  if(nights.length){
    const lastN=nights[nights.length-1];
    const ns=segs.filter(x=>x.night===lastN && isFinite(x.ms)).sort((a,b)=>a.ms-b.ms);
    if(ns.length){
      const w0=ns[0].ms, w1=Math.max(...ns.map(x=>x.ms+x.dur*60000));
      const endClock=d=>{ const t=new Date(d); return String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0'); };
      hypno={date:lastN, start:fmtClock(ns[0].raw), end:endClock(w1), total:Math.round((w1-w0)/60000),
        segs:ns.map(x=>({stage:x.stage, off:Math.round((x.ms-w0)/60000), dur:Math.round(x.dur)}))};
    }
  }
  return {
    sleep: keep(stages).map(([date,s])=>({date,hours:+(s.asleep/60).toFixed(1),awake:Math.round(s.awake),rem:Math.round(s.rem),core:Math.round(s.core),deep:Math.round(s.deep),score:sleepScore(s)})),
    hypno,
    steps: keep(steps).map(([date,v])=>({date,count:Math.round(v)})),
    hr: avgDay(hrByDay).map(([date,v])=>({date,avg:v})),
    rest: keep(restByDay).map(([date,v])=>({date,rest:Math.round(v)})),
    energy: keep(energy).map(([date,v])=>({date,kcal:Math.round(v)})),
    exo: keep(exo).map(([date,v])=>({date,min:Math.round(v)})),
    hrv: avgDay(hrvByDay).map(([date,v])=>({date,ms:v})),
    weight: keep(weight).map(([date,v])=>({date,kg:+v.toFixed(1)})),
    vo2: vo2.val?Math.round(vo2.val):0,
    workouts: workouts.sort((a,b)=>a.date<b.date?1:-1).slice(0,40)
  };
}

const SLEEP_COLORS={deep:'#1d4ed8',core:'#60a5fa',rem:'#a78bfa',awake:'#6b7280'};
function sleepBreakdown(n){
  const tot=n.deep+n.core+n.rem+n.awake; if(tot<=0) return '';
  const pct=v=>(v/tot*100).toFixed(1);
  const seg=(k)=>n[k]>0?`<div style="width:${pct(n[k])}%;background:${SLEEP_COLORS[k]}"></div>`:'';
  const leg=(k,lbl)=>n[k]>0?`<div style="display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:3px;background:${SLEEP_COLORS[k]}"></span><span style="color:var(--muted)">${lbl}</span><b>${fmtMin(n[k])}</b></div>`:'';
  return `<div style="display:flex;height:16px;border-radius:8px;overflow:hidden;margin:14px 0 12px">${seg('deep')}${seg('core')}${seg('rem')}${seg('awake')}</div>
    <div style="display:flex;flex-wrap:wrap;gap:10px 16px;font-size:12px">${leg('deep','Profond')}${leg('rem','Paradoxal')}${leg('core','Léger')}${leg('awake','Éveillé')}</div>`;
}

function renderHealth(){
  healthCharts.forEach(c=>c.destroy()); healthCharts=[];
  const h=DB.health;
  if(!h){ $('health-content').innerHTML=''; return; }
  $('health-status').textContent='✅ Dernière mise à jour : '+fmtDate(h.imported);
  const avg=(a,k)=>a.length?a.reduce((s,x)=>s+x[k],0)/a.length:0;
  const avgSleep=h.sleep.length?avg(h.sleep,'hours').toFixed(1):'—';
  const avgSteps=h.steps.length?Math.round(avg(h.steps,'count')).toLocaleString('fr-FR'):'—';
  const avgRest=h.rest.length?Math.round(avg(h.rest,'rest')):(h.hr.length?Math.round(avg(h.hr,'avg')):'—');
  const lastNight=h.sleep.length?h.sleep[h.sleep.length-1]:null;
  const hasStages=lastNight && lastNight.deep!==undefined && (lastNight.deep+lastNight.core+lastNight.rem+lastNight.awake)>0;
  // métriques secondaires présentes [clé, libellé, valeur]
  const sec=[];
  if((h.energy||[]).length) sec.push(['energy','Énergie active',Math.round(avg(h.energy,'kcal'))+' kcal']);
  if((h.exo||[]).length) sec.push(['exo','Exercice / jour',Math.round(avg(h.exo,'min'))+' min']);
  if((h.hrv||[]).length) sec.push(['hrv','VFC (HRV)',Math.round(avg(h.hrv,'ms'))+' ms']);
  if(h.vo2) sec.push(['','VO₂ max',h.vo2+'']);
  if((h.weight||[]).length) sec.push(['weight','Poids',h.weight[h.weight.length-1].kg+' kg']);
  const chev='<svg style="width:18px;height:18px;stroke:var(--muted);stroke-width:2;fill:none;flex-shrink:0" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';

  $('health-content').innerHTML=`
    ${lastNight?`<div class="card tap" data-m="sleep" style="margin-top:14px;cursor:pointer">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div><div style="font-size:12px;color:var(--muted)">Dernière nuit · ${fmtDate(lastNight.date)}</div>
        <div style="font-size:28px;font-weight:700;line-height:1.1">${lastNight.hours} h <span style="font-size:13px;color:var(--muted);font-weight:400">de sommeil</span></div></div>
        ${lastNight.score?`<div style="text-align:center"><div style="font-size:30px;font-weight:700;color:#a78bfa;line-height:1">${lastNight.score}</div><div style="font-size:10px;color:var(--muted)">score /100*</div></div>`:''}
      </div>
      ${hasStages?sleepBreakdown(lastNight):'<div style="font-size:12px;color:var(--muted);margin-top:8px">Phases non disponibles (nécessite le suivi sommeil Apple Watch).</div>'}
      <div style="text-align:center;font-size:11px;color:var(--accent);margin-top:10px">Voir le détail (semaine, mois…)</div>
    </div>`:''}

    <div class="stats">
      <div class="stat tap" data-m="sleep" style="cursor:pointer"><div class="n">${avgSleep}</div><div class="l">Sommeil moy. (h)</div></div>
      <div class="stat tap" data-m="steps" style="cursor:pointer"><div class="n">${avgSteps}</div><div class="l">Pas / jour</div></div>
      <div class="stat tap" data-m="rest" style="cursor:pointer"><div class="n">${avgRest}</div><div class="l">FC repos</div></div>
    </div>
    ${sec.length?`<div class="stats" style="grid-template-columns:repeat(${Math.min(sec.length,3)},1fr)">`+sec.slice(0,6).map(s=>`<div class="stat${s[0]?' tap':''}" ${s[0]?`data-m="${s[0]}" style="cursor:pointer"`:''}><div class="n" style="font-size:18px">${s[2]}</div><div class="l">${s[1]}</div></div>`).join('')+`</div>`:''}

    ${h.sleep.length?`<div class="card"><div style="font-size:13px;color:var(--muted);margin-bottom:6px">😴 Durée de sommeil (30 j)</div><div class="chart-wrap"><canvas id="ch-sleep"></canvas></div></div>`:''}
    ${h.steps.length?`<div class="card"><div style="font-size:13px;color:var(--muted);margin-bottom:6px">👟 Pas par jour</div><div class="chart-wrap"><canvas id="ch-steps"></canvas></div></div>`:''}
    ${(h.energy||[]).length?`<div class="card"><div style="font-size:13px;color:var(--muted);margin-bottom:6px">🔥 Énergie active (kcal)</div><div class="chart-wrap"><canvas id="ch-energy"></canvas></div></div>`:''}
    ${h.hr.length?`<div class="card"><div style="font-size:13px;color:var(--muted);margin-bottom:6px">❤️ Fréquence cardiaque moyenne</div><div class="chart-wrap"><canvas id="ch-hr"></canvas></div></div>`:''}
    ${(h.weight||[]).length>1?`<div class="card"><div style="font-size:13px;color:var(--muted);margin-bottom:6px">⚖️ Poids (kg)</div><div class="chart-wrap"><canvas id="ch-weight"></canvas></div></div>`:''}
    ${h.workouts.length?`<div class="section-title">⌚ Séances Apple Watch</div><div class="card" id="health-workouts"></div>`:''}
    <p style="font-size:11px;color:var(--muted);padding:4px 4px 0">*Score de sommeil estimé par l'app à partir des phases (Apple ne le fournit pas dans l'export).</p>`;

  if(h.sleep.length) healthCharts.push(barChart('ch-sleep',h.sleep.map(x=>fmtDate(x.date)),h.sleep.map(x=>x.hours),'#7f77dd','h'));
  if(h.steps.length) healthCharts.push(barChart('ch-steps',h.steps.map(x=>fmtDate(x.date)),h.steps.map(x=>x.count),'#1d9e75',''));
  if((h.energy||[]).length) healthCharts.push(barChart('ch-energy',h.energy.map(x=>fmtDate(x.date)),h.energy.map(x=>x.kcal),'#d85a30','kcal'));
  if(h.hr.length) healthCharts.push(lineChart('ch-hr',h.hr.map(x=>fmtDate(x.date)),h.hr.map(x=>x.avg),'#d4537e','bpm'));
  if((h.weight||[]).length>1) healthCharts.push(lineChart('ch-weight',h.weight.map(x=>fmtDate(x.date)),h.weight.map(x=>x.kg),'#1d9e75','kg'));
  if(h.workouts.length){
    $('health-workouts').innerHTML=h.workouts.slice(0,15).map(w=>`
      <div class="log-item">
        <div class="d">${fmtDate(w.date)}</div>
        <div class="v">${workoutName(w.act)} ${w.dist?'· '+w.dist.toFixed(1)+' km':''}</div>
        <span style="font-size:13px;color:var(--muted)">${w.dur} min${w.kcal?' · '+w.kcal+' kcal':''}</span></div>`).join('');
  }
  document.querySelectorAll('#health-content [data-m]').forEach(el=>el.onclick=()=>openHealthDetail(el.dataset.m));
}

/* ============ DÉTAIL SANTÉ (à la Apple Santé : Nuit / Semaine / Mois / 6 mois) ============ */
const HMETRICS={
  sleep:{name:'Sommeil',sleep:true},
  steps:{name:'Pas',key:'count',color:'#1d9e75',type:'bar',unit:'',round:0},
  rest:{name:'Fréquence cardiaque au repos',key:'rest',color:'#d4537e',type:'line',unit:'bpm',round:0},
  energy:{name:'Énergie active',key:'kcal',color:'#d85a30',type:'bar',unit:'kcal',round:0},
  exo:{name:'Minutes d’exercice',key:'min',color:'#ba7517',type:'bar',unit:'min',round:0},
  hrv:{name:'Variabilité cardiaque',key:'ms',color:'#7f77dd',type:'line',unit:'ms',round:0},
  weight:{name:'Poids',key:'kg',color:'#1d9e75',type:'line',unit:'kg',round:1}
};
let curHM='sleep', curHP='7';
function openHealthDetail(m){ if(!HMETRICS[m])return; curHM=m; curHP=(m==='sleep')?'nuit':'7'; renderHDetail(); show('view-hdetail'); }

function hWeekly(arr,keys){ const out=[]; const start=Math.max(0,arr.length-182); for(let i=start;i<arr.length;i+=7){ const c=arr.slice(i,i+7); if(!c.length)continue; const o={date:c[c.length-1].date}; keys.forEach(k=>o[k]=c.reduce((s,x)=>s+(x[k]||0),0)/c.length); out.push(o);} return out; }
function rangeLabel(arr){ if(!arr.length)return''; return fmtDate(arr[0].date)+' – '+fmtDate(arr[arr.length-1].date); }

function renderHDetail(){
  healthCharts.forEach(c=>c.destroy()); healthCharts=[];
  const h=DB.health, def=HMETRICS[curHM];
  $('hd-title').textContent=def.name;
  const tabs= def.sleep? [['nuit','Nuit'],['7','Sem.'],['30','Mois'],['180','6 mois']] : [['7','Sem.'],['30','Mois'],['180','6 mois']];
  $('hd-tabs').innerHTML=tabs.map(t=>`<div class="tab ${curHP===t[0]?'on':''}" data-p="${t[0]}">${t[1]}</div>`).join('');
  document.querySelectorAll('#hd-tabs .tab').forEach(el=>el.onclick=()=>{ curHP=el.dataset.p; renderHDetail(); });
  if(def.sleep) renderSleepDetail(h); else renderMetricDetail(h,def);
}

function renderSleepDetail(h){
  const C=$('hd-content');
  if(curHP==='nuit'){
    const hy=h.hypno, ln=h.sleep[h.sleep.length-1];
    if(!hy){ C.innerHTML='<div class="empty">Pas de phases pour la dernière nuit.<br>(nécessite le suivi sommeil Apple Watch)</div>'; $('hd-sub').textContent=ln?fmtFull(ln.date):''; return; }
    $('hd-sub').textContent=fmtFull(hy.date)+' · '+hy.start+' → '+hy.end;
    const lanes=[['awake','Éveillé'],['rem','Paradoxal'],['core','Léger'],['deep','Profond']];
    const idx={awake:0,rem:1,core:2,deep:3}, LH=26;
    const bars=hy.segs.map(s=>`<div style="position:absolute;left:${(s.off/hy.total*100).toFixed(2)}%;width:${Math.max(0.5,s.dur/hy.total*100).toFixed(2)}%;top:${idx[s.stage]*LH+4}px;height:${LH-8}px;background:${SLEEP_COLORS[s.stage]};border-radius:3px"></div>`).join('');
    C.innerHTML=`
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div><div style="font-size:13px;color:var(--muted)">Sommeil</div><div style="font-size:26px;font-weight:700">${ln.hours} h</div></div>
          ${ln.score?`<div style="text-align:center"><div style="font-size:28px;font-weight:700;color:#a78bfa">${ln.score}</div><div style="font-size:10px;color:var(--muted)">score /100</div></div>`:''}
        </div>
        <div style="display:flex;margin-top:14px">
          <div style="width:62px;flex-shrink:0;font-size:10px;color:var(--muted)">${lanes.map(l=>`<div style="height:${LH}px;line-height:${LH}px">${l[1]}</div>`).join('')}</div>
          <div style="flex:1;position:relative;height:${LH*4}px;border-left:1px solid var(--line)">${bars}</div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-left:62px;margin-top:4px"><span>${hy.start}</span><span>${hy.end}</span></div>
      </div>
      ${sleepBreakdown(ln)? '<div class="card">'+sleepBreakdown(ln)+'</div>':''}`;
    return;
  }
  // Semaine / Mois / 6 mois
  const days=+curHP;
  let nights=h.sleep.slice(-days);
  let chartNights=nights;
  if(curHP==='180') chartNights=hWeekly(nights,['deep','core','rem','awake','hours']);
  $('hd-sub').textContent=rangeLabel(nights);
  const a=(k)=>nights.length?nights.reduce((s,x)=>s+x[k],0)/nights.length:0;
  const avgH=a('hours');
  C.innerHTML=`
    <div class="card">
      <div style="font-size:12px;color:var(--muted);letter-spacing:.5px">MOYENNE</div>
      <div style="font-size:30px;font-weight:700">${fmtMin(avgH*60)}</div>
      <div style="font-size:12px;color:var(--muted)">de sommeil par nuit</div>
      <div class="chart-wrap" style="height:200px;margin-top:10px"><canvas id="hd-canvas"></canvas></div>
    </div>
    <div class="card">
      <div style="font-size:13px;color:var(--muted);margin-bottom:10px">Moyenne par phase</div>
      ${[['deep','Profond'],['rem','Paradoxal'],['core','Léger'],['awake','Éveillé']].map(p=>`
        <div style="display:flex;align-items:center;gap:10px;padding:7px 0">
          <span style="width:11px;height:11px;border-radius:3px;background:${SLEEP_COLORS[p[0]]}"></span>
          <span style="flex:1;font-size:14px">${p[1]}</span>
          <b>${fmtMin(a(p[0]))}</b></div>`).join('')}
    </div>`;
  healthCharts.push(sleepStackChart('hd-canvas',chartNights));
}

function sleepStackChart(id,nights){
  const mk=(lbl,k,c)=>({label:lbl,data:nights.map(n=>+((n[k]||0)/60).toFixed(2)),backgroundColor:c,borderRadius:3,stack:'s'});
  return new Chart($(id),{type:'bar',
    data:{labels:nights.map(n=>fmtDate(n.date)),datasets:[mk('Profond','deep',SLEEP_COLORS.deep),mk('Léger','core',SLEEP_COLORS.core),mk('Paradoxal','rem',SLEEP_COLORS.rem),mk('Éveillé','awake',SLEEP_COLORS.awake)]},
    options:{responsive:true,maintainAspectRatio:false,animation:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.dataset.label+': '+c.parsed.y.toFixed(1)+' h'}}},
      scales:{x:{stacked:true,grid:{display:false},ticks:{color:'#9aa3b2',font:{size:9},maxTicksLimit:8}},y:{stacked:true,grid:{color:'#2b2f3a'},ticks:{color:'#9aa3b2',font:{size:10}}}}}});
}

function renderMetricDetail(h,def){
  const C=$('hd-content');
  let arr=(h[curHM]||[]).slice(-(+curHP));
  let chartArr=arr;
  if(curHP==='180') chartArr=hWeekly(arr,[def.key]);
  $('hd-sub').textContent=rangeLabel(arr);
  const avgV=arr.length?arr.reduce((s,x)=>s+x[def.key],0)/arr.length:0;
  const fmtV=v=>def.round?v.toFixed(def.round):Math.round(v).toLocaleString('fr-FR');
  C.innerHTML=`
    <div class="card">
      <div style="font-size:12px;color:var(--muted);letter-spacing:.5px">MOYENNE</div>
      <div style="font-size:30px;font-weight:700">${fmtV(avgV)} <span style="font-size:14px;color:var(--muted);font-weight:400">${def.unit}</span></div>
      <div class="chart-wrap" style="height:210px;margin-top:10px"><canvas id="hd-canvas"></canvas></div>
    </div>`;
  const labels=chartArr.map(x=>fmtDate(x.date)), data=chartArr.map(x=>+x[def.key].toFixed(def.round||0));
  healthCharts.push(def.type==='line'?lineChart('hd-canvas',labels,data,def.color,def.unit):barChart('hd-canvas',labels,data,def.color,def.unit));
}

function barChart(id,labels,data,color,unit){
  return new Chart($(id),{type:'bar',data:{labels,datasets:[{data,backgroundColor:color,borderRadius:4}]},
    options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.parsed.y+(unit?' '+unit:'')}}},
      scales:{x:{grid:{display:false},ticks:{color:'#9aa3b2',font:{size:10},maxTicksLimit:8}},y:{grid:{color:'#2b2f3a'},ticks:{color:'#9aa3b2',font:{size:10}}}}}});
}
function lineChart(id,labels,data,color,unit){
  return new Chart($(id),{type:'line',data:{labels,datasets:[{data,borderColor:color,backgroundColor:color+'22',borderWidth:3,tension:.35,fill:true,pointRadius:2}]},
    options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.parsed.y+(unit?' '+unit:'')}}},
      scales:{x:{grid:{display:false},ticks:{color:'#9aa3b2',font:{size:10},maxTicksLimit:8}},y:{grid:{color:'#2b2f3a'},ticks:{color:'#9aa3b2',font:{size:10}}}}}});
}

/* ============ NUTRITION (Open Food Facts) ============ */
const OFF='https://world.openfoodfacts.org';
let nutScanner=null, pendingFood=null;
function nutNum(x){ const v=parseFloat(x); return isFinite(v)?v:0; }
function todayFoods(){ const d=DB.nutrition.days; return d[todayISO()]=d[todayISO()]||[]; }
function foodTotals(list){ return list.reduce((t,f)=>({kcal:t.kcal+f.kcal,prot:t.prot+f.prot,carb:t.carb+f.carb,fat:t.fat+f.fat}),{kcal:0,prot:0,carb:0,fat:0}); }

function renderNutrition(){
  $('nut-date').textContent=new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
  const N=DB.nutrition, list=todayFoods(), t=foodTotals(list);
  const bar=(val,goal,color,label,unit)=>{
    const pct=Math.min(100,goal?val/goal*100:0);
    return `<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><span>${label}</span><span><b>${Math.round(val)}</b> / ${goal} ${unit}</span></div>
      <div style="height:8px;border-radius:4px;background:var(--surface2);overflow:hidden"><div style="width:${pct}%;height:100%;background:${color}"></div></div></div>`;
  };
  const carbG=Math.round(N.goalKcal*0.4/4), fatG=Math.round(N.goalKcal*0.3/9);
  $('nut-summary').innerHTML=`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px">
      <div><span style="font-size:32px;font-weight:700">${Math.round(t.kcal)}</span> <span style="color:var(--muted)">/ ${N.goalKcal} kcal</span></div>
      <div style="font-size:13px;color:${t.kcal>N.goalKcal?'#ef4444':'var(--accent2)'}">${Math.round(N.goalKcal-t.kcal)} restantes</div>
    </div>
    ${bar(t.kcal,N.goalKcal,'#3b82f6','Calories','kcal')}
    ${bar(t.prot,N.goalProt,'#22c55e','Protéines','g')}
    ${bar(t.carb,carbG,'#f59e0b','Glucides','g')}
    ${bar(t.fat,fatG,'#d4537e','Lipides','g')}
  </div>`;

  $('nut-recent').innerHTML=N.recent.length?`<div class="section-title" style="margin-top:4px">Récents (1 clic)</div><div class="pill-row">`+
    N.recent.slice(0,8).map((r,i)=>`<span class="pill" data-r="${i}">${r.name}</span>`).join('')+`</div>`:'';
  document.querySelectorAll('#nut-recent .pill').forEach(el=>el.onclick=()=>openAddFood({...N.recent[+el.dataset.r]}));

  $('nut-list').innerHTML=list.length?list.map(f=>`
    <div class="log-item">
      <div class="v" style="flex:1;font-weight:400"><div style="font-weight:500">${f.name}</div><div style="font-size:12px;color:var(--muted)">${f.qty} g · ${Math.round(f.kcal)} kcal · P${Math.round(f.prot)} G${Math.round(f.carb)} L${Math.round(f.fat)}</div></div>
      <span class="delete" data-i="${f.id}">Suppr</span></div>`).join('')
    :`<div class="empty"><svg viewBox="0 0 24 24"><path d="M6 3v18M6 8h4M18 3c-1 3-1 6 0 9v9"/></svg><div>Rien pour aujourd'hui.<br>Scanne un produit ou ajoute un aliment 🍎</div></div>`;
  document.querySelectorAll('#nut-list .delete').forEach(el=>el.onclick=()=>{ DB.nutrition.days[todayISO()]=todayFoods().filter(f=>f.id!=el.dataset.i); save(); renderNutrition(); });

  $('nut-meals').innerHTML=N.meals.length?`<div class="section-title">Repas types (1 clic)</div>`+N.meals.map((m,i)=>`
    <div class="ex-row" data-meal="${i}"><div class="ex-thumb"><svg viewBox="0 0 24 24"><path d="M4 3v18M4 8h4M18 3c-1 3-1 6 0 9v9"/></svg></div>
      <div class="ex-info"><div class="t">${m.name}</div><div class="s">${m.items.length} aliments · ${Math.round(foodTotals(m.items).kcal)} kcal</div></div>
      <span class="delete" data-mdel="${i}">Suppr</span></div>`).join(''):'';
  document.querySelectorAll('#nut-meals [data-meal]').forEach(el=>el.onclick=e=>{ if(e.target.dataset.mdel!==undefined)return; N.meals[+el.dataset.meal].items.forEach(it=>todayFoods().push({...it,id:nowTs()})); save(); renderNutrition(); });
  document.querySelectorAll('#nut-meals [data-mdel]').forEach(el=>el.onclick=e=>{ e.stopPropagation(); if(confirm('Supprimer ce repas type ?')){ N.meals.splice(+el.dataset.mdel,1); save(); renderNutrition(); } });
}

function productToFood(p){
  const n=p.nutriments||{};
  return { name:(p.product_name_fr||p.product_name||'Produit').slice(0,60),
    brand:(p.brands||'').split(',')[0].trim(),
    per100:{kcal:Math.round(nutNum(n['energy-kcal_100g'])), prot:+nutNum(n.proteins_100g).toFixed(1), carb:+nutNum(n.carbohydrates_100g).toFixed(1), fat:+nutNum(n.fat_100g).toFixed(1)},
    serving:Math.round(nutNum(p.serving_quantity))||100 };
}

function openAddFood(food){
  closeSheets();
  pendingFood=food||{name:'',brand:'',per100:{kcal:0,prot:0,carb:0,fat:0},serving:100};
  const p=pendingFood.per100||{kcal:0,prot:0,carb:0,fat:0};
  $('af-name').value=pendingFood.name||'';
  $('af-brand').textContent=pendingFood.brand||'';
  $('af-kcal').value=p.kcal||''; $('af-prot').value=p.prot||''; $('af-carb').value=p.carb||''; $('af-fat').value=p.fat||'';
  $('af-qty').value=pendingFood.serving||100;
  updateAfTotal(); openSheet('sheet-addfood');
}
function afVals(){ const qty=nutNum($('af-qty').value)||0, f=qty/100;
  return { kcal:nutNum($('af-kcal').value)*f, prot:nutNum($('af-prot').value)*f, carb:nutNum($('af-carb').value)*f, fat:nutNum($('af-fat').value)*f, qty }; }
function updateAfTotal(){ const v=afVals(); $('af-total').innerHTML=`<div style="font-size:22px;font-weight:700">${Math.round(v.kcal)} kcal</div><div style="font-size:13px;color:var(--muted)">Protéines ${v.prot.toFixed(1)} g · Glucides ${v.carb.toFixed(1)} g · Lipides ${v.fat.toFixed(1)} g</div>`; }
['af-kcal','af-prot','af-carb','af-fat','af-qty'].forEach(id=>$(id).addEventListener('input',updateAfTotal));
$('af-save').onclick=()=>{
  const v=afVals(); if(!v.qty){ alert('Indique une quantité (g)'); return; }
  const name=$('af-name').value.trim()||'Aliment';
  const per100={kcal:nutNum($('af-kcal').value),prot:nutNum($('af-prot').value),carb:nutNum($('af-carb').value),fat:nutNum($('af-fat').value)};
  const brand=pendingFood?pendingFood.brand:'';
  todayFoods().push({id:nowTs(),name,brand,qty:v.qty,kcal:v.kcal,prot:v.prot,carb:v.carb,fat:v.fat,per100});
  DB.nutrition.recent=[{name,brand,per100,serving:v.qty},...DB.nutrition.recent.filter(r=>r.name!==name)].slice(0,12);
  save(); closeSheets(); renderNutrition();
};

/* --- scan code-barres --- */
$('nut-scan').onclick=startScan;
function startScan(){
  openSheet('sheet-scan'); $('scan-status').textContent='Démarrage caméra…';
  if(typeof Html5Qrcode==='undefined'){ $('scan-status').textContent='Scanner indisponible (recharge la page).'; return; }
  nutScanner=new Html5Qrcode('reader',{formatsToSupport:[
    Html5QrcodeSupportedFormats.EAN_13,Html5QrcodeSupportedFormats.EAN_8,
    Html5QrcodeSupportedFormats.UPC_A,Html5QrcodeSupportedFormats.UPC_E,
    Html5QrcodeSupportedFormats.CODE_128,Html5QrcodeSupportedFormats.CODE_39]});
  nutScanner.start({facingMode:'environment'},{fps:10,qrbox:{width:260,height:170}},
    code=>{ stopScan(); lookupBarcode(code); }, ()=>{})
    .then(()=>$('scan-status').textContent='Vise le code-barres du produit…')
    .catch(e=>{ $('scan-status').textContent='Caméra refusée/indisponible. Autorise la caméra ou utilise « Rechercher ».'; });
}
function stopScan(){ if(nutScanner){ const s=nutScanner; nutScanner=null; s.stop().then(()=>s.clear()).catch(()=>{}); } }
$('scan-close').onclick=()=>{ closeSheets(); };
async function lookupBarcode(code){
  $('scan-status').textContent='Recherche du produit…';
  try{
    const r=await fetch(OFF+'/api/v2/product/'+encodeURIComponent(code)+'.json');
    const d=await r.json();
    if(d.status===1 && d.product && (d.product.product_name||d.product.nutriments)){ openAddFood(productToFood(d.product)); }
    else { closeSheets(); if(confirm('Produit introuvable ('+code+').\nL\'ajouter manuellement ?')) openAddFood(null); }
  }catch(e){ closeSheets(); alert('Erreur réseau : '+e.message); }
}

/* --- recherche par nom --- */
let sfFoods=[];
$('nut-search').onclick=()=>{ $('sf-input').value=''; $('sf-results').innerHTML=''; openSheet('sheet-search'); };
$('sf-go').onclick=doSearch;
$('sf-input').addEventListener('keydown',e=>{ if(e.key==='Enter') doSearch(); });
async function doSearch(){
  const term=$('sf-input').value.trim(); if(!term)return;
  $('sf-results').innerHTML='<div style="text-align:center;color:var(--muted);padding:16px">Recherche…</div>';
  try{
    const r=await fetch('/.netlify/functions/off?q='+encodeURIComponent(term));
    const d=await r.json();
    sfFoods=(d.products||[]).map(productToFood).filter(f=>f.per100.kcal>0);
    if(!sfFoods.length){ $('sf-results').innerHTML='<div style="text-align:center;color:var(--muted);padding:16px">Aucun résultat. Essaie l\'ajout manuel.</div>'; return; }
    $('sf-results').innerHTML=sfFoods.map((f,i)=>`<div class="ex-row" data-i="${i}"><div class="ex-info"><div class="t">${f.name}</div><div class="s">${f.brand?f.brand+' · ':''}${f.per100.kcal} kcal/100g · P${f.per100.prot}</div></div></div>`).join('');
    document.querySelectorAll('#sf-results .ex-row').forEach(el=>el.onclick=()=>openAddFood({...sfFoods[+el.dataset.i]}));
  }catch(e){ $('sf-results').innerHTML='<div style="text-align:center;color:#ef4444;padding:16px">Erreur réseau</div>'; }
}

/* --- manuel / objectifs / repas --- */
$('nut-manual').onclick=()=>openAddFood(null);
$('nut-goals-btn').onclick=()=>{ $('g-kcal').value=DB.nutrition.goalKcal; $('g-prot').value=DB.nutrition.goalProt; openSheet('sheet-goals'); };
$('g-save').onclick=()=>{ DB.nutrition.goalKcal=parseInt($('g-kcal').value)||2200; DB.nutrition.goalProt=parseInt($('g-prot').value)||180; save(); closeSheets(); renderNutrition(); };
$('nut-savemeal').onclick=()=>{ if(!todayFoods().length){ alert('Ajoute d\'abord des aliments aujourd\'hui.'); return; } $('meal-name').value=''; openSheet('sheet-meal'); };
$('meal-save').onclick=()=>{ const name=$('meal-name').value.trim(); if(!name)return; DB.nutrition.meals.push({name,items:todayFoods().map(f=>({name:f.name,brand:f.brand,qty:f.qty,kcal:f.kcal,prot:f.prot,carb:f.carb,fat:f.fat,per100:f.per100}))}); save(); closeSheets(); renderNutrition(); };

/* ============ NAVIGATION ============ */
function show(view){
  ['view-home','view-group','view-ex','view-cardio','view-live','view-cardio-detail','view-photos','view-nutrition','view-sante','view-hdetail','view-wellness','view-routine','view-slist','view-stretch-detail','view-stretch-play']
    .forEach(v=>$(v).classList.toggle('hide',v!==view));
  window.scrollTo(0,0);
}
function navView(nav){
  document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.nav===nav));
  if(nav==='home'){ renderHome(); show('view-home'); }
  else if(nav==='cardio'){ renderCardio(); show('view-cardio'); }
  else if(nav==='photos'){ renderPhotos(); show('view-photos'); }
  else if(nav==='nutrition'){ renderNutrition(); show('view-nutrition'); }
  else if(nav==='sante'){ show('view-sante'); renderHealth(); }
  else if(nav==='wellness'){ renderWellness(); show('view-wellness'); }
}
document.querySelectorAll('.nav a').forEach(a=>a.onclick=()=>navView(a.dataset.nav));
document.querySelectorAll('[data-go]').forEach(el=>el.onclick=()=>navView(el.dataset.go));
$('back-group').onclick=()=>openGroup(cur.gid);

/* ============ INIT ============ */
(async function init(){
  if(!DB.name){ DB.name='Yohan'; save(); }
  $('hello').textContent='Salut '+DB.name+' 💪';
  $('avatar').textContent=(DB.name[0]||'M').toUpperCase();
  renderHome();
  scheduleAll();
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
  // Retour de connexion Strava ?
  if(location.search.indexOf('code=')>-1 || location.search.indexOf('error=')>-1){
    const wasStrava=await handleStravaCallback();
    if(wasStrava){ navView('cardio'); if(DB.strava) stravaSync(); }
  }
})();
