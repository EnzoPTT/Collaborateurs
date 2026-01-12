import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  AlertCircle, 
  Briefcase,
  MapPin,
  FileText,
  ChevronDown,
  ChevronUp,
  User,
  Clock,
  Euro,
  BarChart3,
  LogOut
} from 'lucide-react';

// --- CONFIGURATION & CONSTANTES ---

const COLORS = {
  primary: '#3D8C70', // Vert Rainette
  text: '#252322',    // Noir Profond
  bg: '#F2F2F2',      // Blanc Cassé
  danger: '#EF4444',
  glass: 'rgba(255, 255, 255, 0.65)',
  glassBorder: 'rgba(255, 255, 255, 0.4)',
};

// Palette 100% Verts pour les graphiques (plus de jaune/rouge)
const CHART_COLORS = [
  '#14352A', '#1D4A3B', '#26604D', '#2C6652', '#357C63',
  '#3D8C70', '#4DA386', '#5DA389', '#6EB096', '#82BAA3',
  '#96C4B0', '#A8D1C0', '#BBE0D0'
];

const STORAGE_KEY = 'rainette_rh_hub_v8';

// --- DONNÉES INITIALES ---

const RAW_EMPLOYEES = [
  // Direction
  { nom: "Ruyffelaere", prenom: "Maximilien", agenceId: "jenlain", posteId: "direction" },
  { nom: "Delattre", prenom: "Manon", agenceId: "jenlain", posteId: "direction" },
  { nom: "Dimarcq", prenom: "Lucie", agenceId: "jenlain", posteId: "direction" },
  { nom: "Kotrys", prenom: "Mireille", agenceId: "jenlain", posteId: "direction" },
  { nom: "Amenhar", prenom: "Naïma", agenceId: "jenlain", posteId: "direction" },
  { nom: "Ciriez", prenom: "Anne-Sophie", agenceId: "jenlain", posteId: "direction" },
  { nom: "Dumazy", prenom: "Coralie", agenceId: "jenlain", posteId: "direction" },
  { nom: "Petitto", prenom: "Enzo", agenceId: "jenlain", posteId: "direction" },
  // Équipes Jenlain
  { nom: "Pinte", prenom: "Aurélie", agenceId: "jenlain", posteId: "resp-secteur" },
  { nom: "Blervaque", prenom: "Laura", agenceId: "jenlain", posteId: "resp-agence" },
  { nom: "Latreille", prenom: "Anaïs", agenceId: "jenlain", posteId: "chef-projet" },
  { nom: "Mauroy", prenom: "Emeline", agenceId: "jenlain", posteId: "chef-projet" },
  { nom: "Locquet", prenom: "Baptiste", agenceId: "jenlain", posteId: "chef-projet" },
  { nom: "Gambier", prenom: "Lolita", agenceId: "jenlain", posteId: "chef-projet" },
  { nom: "Gellee", prenom: "Florent", agenceId: "jenlain", posteId: "ce-faune" },
  { nom: "Dagneau", prenom: "Loick", agenceId: "jenlain", posteId: "ce-faune" },
  { nom: "Leroi", prenom: "Armand", agenceId: "jenlain", posteId: "ce-faune" },
  { nom: "Chochoy", prenom: "Lily", agenceId: "jenlain", posteId: "ce-faune" },
  { nom: "Bosca", prenom: "Louis", agenceId: "jenlain", posteId: "ce-faune" },
  { nom: "Janquin", prenom: "François", agenceId: "st-omer", posteId: "ce-faune" },
  { nom: "Mandy", prenom: "Tatjana", agenceId: "jenlain", posteId: "ce-flore" },
  { nom: "Philippe", prenom: "Clélie", agenceId: "jenlain", posteId: "ce-flore" },
  { nom: "Dylewski", prenom: "Sarah", agenceId: "jenlain", posteId: "ce-flore" },
  { nom: "Delhaye", prenom: "Perrine", agenceId: "jenlain", posteId: "ce-flore" },
  // Pompey / Colmar
  { nom: "Poesy", prenom: "Camille", agenceId: "pompey", posteId: "resp-agence" },
  { nom: "Claude", prenom: "Océane", agenceId: "pompey", posteId: "chef-projet" },
  { nom: "Engel", prenom: "Matthias", agenceId: "pompey", posteId: "chef-projet" },
  { nom: "Fouvet", prenom: "Kitty", agenceId: "colmar", posteId: "chef-projet" },
  { nom: "Dubrulle", prenom: "Salomé", agenceId: "pompey", posteId: "chef-projet" },
  { nom: "Grisvard", prenom: "Pierre", agenceId: "pompey", posteId: "ce-faune" },
  { nom: "Badaire", prenom: "Flavien", agenceId: "pompey", posteId: "ce-faune" },
  { nom: "Ferry", prenom: "William", agenceId: "colmar", posteId: "ce-faune" },
  { nom: "Gillis", prenom: "Marie", agenceId: "colmar", posteId: "ce-faune" },
  { nom: "Blanchard", prenom: "Iona", agenceId: "pompey", posteId: "ce-flore" },
  { nom: "Tranquille", prenom: "Soren", agenceId: "pompey", posteId: "ce-flore" },
  { nom: "Lala-Clement", prenom: "Robin", agenceId: "pompey", posteId: "ce-pedo" },
  // Caen / Rouen
  { nom: "Villedieu", prenom: "Camille", agenceId: "caen", posteId: "resp-agence" },
  { nom: "Foucher", prenom: "Coralie", agenceId: "caen", posteId: "chef-projet" },
  { nom: "Marqués Ferri", prenom: "Diégo", agenceId: "caen", posteId: "chef-projet" },
  { nom: "Portemann", prenom: "Joris", agenceId: "rouen", posteId: "chef-projet" },
  { nom: "Gosselin", prenom: "Guillaume", agenceId: "caen", posteId: "ce-faune" },
  { nom: "Legeay", prenom: "Clément", agenceId: "caen", posteId: "ce-faune" },
  { nom: "Saadaoui", prenom: "Hédi", agenceId: "caen", posteId: "ce-faune" },
  { nom: "Potet", prenom: "Eva", agenceId: "caen", posteId: "ce-faune" },
  { nom: "Wisniewski", prenom: "Natasia", agenceId: "rouen", posteId: "ce-faune" },
  { nom: "Ruaults", prenom: "Romane", agenceId: "rouen", posteId: "ce-faune" },
  { nom: "Malbaux", prenom: "Mylène", agenceId: "caen", posteId: "ce-flore" },
  { nom: "Torlai", prenom: "Baptiste", agenceId: "rouen", posteId: "ce-flore" },
  { nom: "Beuron", prenom: "Simon", agenceId: "rouen", posteId: "ce-flore" },
  { nom: "Crevon", prenom: "Baptiste", agenceId: "caen", posteId: "ce-flore" },
  { nom: "Bressin", prenom: "Léo", agenceId: "caen", posteId: "ce-chiro" },
  // Cesson
  { nom: "Cobigo", prenom: "Maxime", agenceId: "cesson", posteId: "resp-agence" },
  { nom: "Barbolla", prenom: "Lucie", agenceId: "cesson", posteId: "chef-projet" },
  { nom: "Menauge", prenom: "Ronan", agenceId: "cesson", posteId: "chef-projet" },
  { nom: "Poirier", prenom: "Gwendal", agenceId: "cesson", posteId: "ce-faune" },
  { nom: "Luu", prenom: "Nathan", agenceId: "cesson", posteId: "ce-faune" },
  { nom: "Lequitte", prenom: "Tristan", agenceId: "cesson", posteId: "ce-faune" },
  { nom: "Perrachon", prenom: "Nathan", agenceId: "cesson", posteId: "ce-flore" },
  { nom: "Clisson", prenom: "Valentin", agenceId: "cesson", posteId: "ce-flore" },
  { nom: "Dutrey", prenom: "Damien", agenceId: "cesson", posteId: "ce-flore" },
  // Toulouse / Bordeaux
  { nom: "Berrabah", prenom: "Rémy", agenceId: "toulouse", posteId: "resp-agence" },
  { nom: "Monnier-Corbel", prenom: "Alice", agenceId: "toulouse", posteId: "chef-projet" },
  { nom: "Colle", prenom: "Josselin", agenceId: "toulouse", posteId: "chef-projet" },
  { nom: "Bossaert", prenom: "Lou-Ann", agenceId: "bordeaux", posteId: "chef-projet" },
  { nom: "Coves", prenom: "Margot", agenceId: "toulouse", posteId: "chef-projet" },
  { nom: "Cazaubon", prenom: "Mathieu", agenceId: "toulouse", posteId: "ce-faune" },
  { nom: "Costa", prenom: "Justine", agenceId: "toulouse", posteId: "ce-faune" },
  { nom: "Regnault", prenom: "Alexandra", agenceId: "bordeaux", posteId: "ce-faune" },
  { nom: "Canard", prenom: "Claire", agenceId: "toulouse", posteId: "ce-flore" },
  { nom: "Tomalak", prenom: "Guillian", agenceId: "toulouse", posteId: "ce-flore" },
  { nom: "Taravaud", prenom: "Noémie", agenceId: "toulouse", posteId: "ce-pedo" },
  { nom: "Doladille", prenom: "Valentin", agenceId: "toulouse", posteId: "ce-pedo" },
  { nom: "Lavaur", prenom: "Paul", agenceId: "toulouse", posteId: "ce-pedo" },
  { nom: "Yken", prenom: "Elsa", agenceId: "toulouse", posteId: "ce-pedo" },
  { nom: "Toralla", prenom: "Aimie", agenceId: "toulouse", posteId: "chef-projet" },
  { nom: "Alran", prenom: "Baptiste", agenceId: "toulouse", posteId: "chef-projet" },
  // Mâcon
  { nom: "Avrillon", prenom: "Hugo", agenceId: "macon", posteId: "chef-projet" },
  { nom: "Mollot", prenom: "Romain", agenceId: "macon", posteId: "ce-faune" },
  { nom: "Leproux", prenom: "Clarysse", agenceId: "macon", posteId: "ce-flore" },
  // Aix
  { nom: "Imbrosciano", prenom: "Carine", agenceId: "aix", posteId: "resp-agence" },
  { nom: "Picot", prenom: "Ines", agenceId: "aix", posteId: "ce-faune" },
  // Le Mans
  { nom: "Lubert", prenom: "Ronan", agenceId: "le-mans", posteId: "ce-faune" },
  { nom: "Fournier", prenom: "Maureen", agenceId: "le-mans", posteId: "ce-flore" },
];

// NOUVELLE STRUCTURE DE GRILLES DYNAMIQUES
const DEFAULT_GRIDS_V8 = [
  {
    id: 'g_cadre',
    title: 'Cadres',
    classificationId: 'ic',
    levels: [
      { name: "Débutant", threshold: 35000 },
      { name: "Niveau 1", threshold: 38000 },
      { name: "Niveau 2", threshold: 42000 },
      { name: "Niveau 3", threshold: 48000 },
      { name: "Niveau 4", threshold: 55000 },
    ]
  },
  {
    id: 'g_cdp',
    title: 'Chefs de projet',
    classificationId: 'etam',
    levels: [
      { name: "Junior", threshold: 28000 },
      { name: "Niveau 1", threshold: 30000 },
      { name: "Niveau 2", threshold: 33000 },
      { name: "Niveau 3", threshold: 36000 },
      { name: "Niveau 4", threshold: 40000 },
    ]
  },
  {
    id: 'g_ce',
    title: "Chargés d'études",
    classificationId: 'etam',
    levels: [
      { name: "Junior", threshold: 24000 },
      { name: "Niveau 1", threshold: 26000 },
      { name: "Niveau 2", threshold: 28000 },
      { name: "Niveau 3", threshold: 31000 },
      { name: "Niveau 4", threshold: 34000 },
    ]
  }
];

// --- UTILITAIRES ---

const generateId = () => Math.random().toString(36).substr(2, 9);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatEuro = (amount) => {
  if (!amount) return '-';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
};

const getDaysDiff = (start, end) => {
  const d1 = new Date(start);
  const d2 = end ? new Date(end) : new Date();
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
};

// Fonction de calcul du niveau basée sur les grilles dynamiques
const getLevel = (salary, grid) => {
  if (!salary || !grid || !grid.levels) return null;
  let currentLevel = null;
  // On suppose que les niveaux sont triés par seuil croissant
  for (const level of grid.levels) {
    if (salary >= level.threshold) {
      currentLevel = level.name;
    }
  }
  return currentLevel || "Hors grille (< Min)";
};

// --- COMPOSANTS UI ---

const Card = ({ children, className = '', title, icon: Icon }) => (
  <div className={`rounded-xl border border-white/40 shadow-sm backdrop-blur-md bg-white/60 p-5 flex flex-col ${className}`}>
    {(title || Icon) && (
      <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
        {Icon && <Icon size={16} />}
        {title}
      </div>
    )}
    {children}
  </div>
);

const Badge = ({ children, color = 'gray', customColor = null }) => {
  const styles = {
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    green: 'bg-[#3D8C70]/10 text-[#3D8C70] border-[#3D8C70]/20',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  
  if (customColor) {
    return (
      <span className="px-2 py-1 rounded-md text-xs font-medium border" style={{ backgroundColor: `${customColor}15`, color: customColor, borderColor: `${customColor}30` }}>
        {children}
      </span>
    );
  }

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${styles[color] || styles.gray}`}>
      {children}
    </span>
  );
};

const Button = ({ children, onClick, variant = 'primary', icon: Icon, className = '', disabled = false }) => {
  const variants = {
    primary: "bg-[#3D8C70] text-white hover:bg-[#2e6b55] shadow-md shadow-[#3D8C70]/20",
    secondary: "bg-white text-[#252322] border border-gray-200 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    ghost: "text-gray-500 hover:text-[#3D8C70] hover:bg-[#3D8C70]/5",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

const InteractivePieChart = ({ data }) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  if (total === 0) return <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">Aucune donnée</div>;

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-32 w-32">
        <svg viewBox="-1.05 -1.05 2.1 2.1" className="transform -rotate-90 overflow-visible">
          {data.map((slice, i) => {
            if (slice.value === 0) return null;
            const startPercent = cumulativePercent;
            const endPercent = cumulativePercent + slice.value / total;
            cumulativePercent = endPercent;
            const [startX, startY] = getCoordinatesForPercent(startPercent);
            const [endX, endY] = getCoordinatesForPercent(endPercent);
            const largeArcFlag = slice.value / total > 0.5 ? 1 : 0;
            
            if (slice.value / total === 1) return <circle key={i} cx="0" cy="0" r="1" fill={slice.color} onMouseEnter={() => setHoveredSlice(slice)} onMouseLeave={() => setHoveredSlice(null)} />;

            const pathData = [`M 0 0`, `L ${startX} ${startY}`, `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, `Z`].join(' ');
            return (
              <path key={i} d={pathData} fill={slice.color} stroke="white" strokeWidth="0.02" className="transition-all duration-200 hover:opacity-90 cursor-pointer" style={{ transform: hoveredSlice?.name === slice.name ? 'scale(1.05)' : 'scale(1)', transformOrigin: 'center' }} onMouseEnter={() => setHoveredSlice(slice)} onMouseLeave={() => setHoveredSlice(null)} />
            );
          })}
        </svg>
        {hoveredSlice && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-lg text-center transform scale-110 transition-transform z-10">
              <div className="text-lg font-bold text-[#3D8C70]">{hoveredSlice.value}</div>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-1 min-w-[120px] overflow-y-auto max-h-[120px] scrollbar-thin pr-2">
        {data.map((slice, i) => (
          <div key={i} className={`flex items-center justify-between text-xs transition-opacity ${hoveredSlice && hoveredSlice.name !== slice.name ? 'opacity-30' : 'opacity-100'}`} onMouseEnter={() => setHoveredSlice(slice)} onMouseLeave={() => setHoveredSlice(null)}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }}></div>
              <span className="truncate max-w-[100px]" title={slice.name}>{slice.name}</span>
            </div>
            <span className="font-semibold">{slice.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPOSANT ADMIN ---

const AdminPanel = ({ data, setData, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('agences');

  const handleRename = (collection, id, newName) => {
    setData(prev => ({ ...prev, [collection]: prev[collection].map(item => item.id === id ? { ...item, nom: newName } : item) }));
  };
  const handleAdd = (collection, name, extra = {}) => {
    if (!name.trim()) return;
    setData(prev => ({ ...prev, [collection]: [...prev[collection], { id: generateId(), nom: name, ...extra }] }));
  };
  const handleDelete = (collection, id) => {
    const list = data[collection];
    const fallback = list.find(i => i.id === 'default' && i.id !== id) || list.find(i => i.id !== id);
    if (!fallback && list.length <= 1) return alert("Impossible de tout supprimer.");
    
    setData(prev => {
      const updatedEmps = prev.employees.map(e => {
        // Fallback logic
        if (collection === 'agences' && e.agenceId === id) return { ...e, agenceId: fallback?.id };
        if (collection === 'postes' && e.posteId === id) return { ...e, posteId: fallback?.id };
        if (collection === 'contrats' && e.contratTypeId === id) return { ...e, contratTypeId: fallback?.id };
        if (collection === 'classifications' && e.classificationId === id) return { ...e, classificationId: fallback?.id };
        if (collection === 'grids' && e.gridId === id) return { ...e, gridId: fallback?.id }; // Si on supprime une grille
        return e;
      });
      return { ...prev, employees: updatedEmps, [collection]: prev[collection].filter(i => i.id !== id) };
    });
  };

  // --- Gestion des Grilles ---
  const handleGridTitleChange = (gridId, newTitle) => {
    setData(prev => ({ ...prev, grids: prev.grids.map(g => g.id === gridId ? { ...g, title: newTitle } : g) }));
  };
  const handleGridClassifChange = (gridId, newClassifId) => {
    setData(prev => ({ ...prev, grids: prev.grids.map(g => g.id === gridId ? { ...g, classificationId: newClassifId } : g) }));
  };
  const handleGridLevelChange = (gridId, idx, field, value) => {
    setData(prev => ({
      ...prev,
      grids: prev.grids.map(g => {
        if (g.id !== gridId) return g;
        const newLevels = [...g.levels];
        newLevels[idx] = { ...newLevels[idx], [field]: field === 'threshold' ? Number(value) : value };
        return { ...g, levels: newLevels };
      })
    }));
  };
  const handleAddGrid = () => {
    const newGrid = {
      id: generateId(),
      title: "Nouvelle Grille",
      classificationId: data.classifications[0]?.id || 'etam',
      levels: [{ name: "Niveau 1", threshold: 30000 }]
    };
    setData(prev => ({ ...prev, grids: [...prev.grids, newGrid] }));
  };

  const handleAddGridLevel = (gridId) => {
    setData(prev => ({
      ...prev,
      grids: prev.grids.map(g => {
        if (g.id !== gridId) return g;
        return { ...g, levels: [...g.levels, { name: "Nouveau", threshold: 0 }] };
      })
    }));
  };

  const handleDeleteGridLevel = (gridId, idx) => {
    setData(prev => ({
      ...prev,
      grids: prev.grids.map(g => {
        if (g.id !== gridId) return g;
        const newLevels = [...g.levels];
        newLevels.splice(idx, 1);
        return { ...g, levels: newLevels };
      })
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F2F2F2]">
          <h2 className="text-xl font-bold text-[#252322]">Réglages</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex border-b border-gray-200 overflow-x-auto">
          {['agences', 'postes', 'contrats', 'rémunération'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 px-4 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-[#3D8C70] text-[#3D8C70]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#F2F2F2]">
          {activeTab === 'rémunération' ? (
            <div className="space-y-8">
              {/* CLASSIFICATIONS */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#3D8C70] uppercase tracking-wider">Classifications (Étiquettes)</h3>
                <div className="flex gap-2 mb-2">
                  <input id="newClassif" type="text" placeholder="Ajouter classification..." className="flex-1 px-3 py-2 border rounded-lg" onKeyDown={(e) => { if(e.key === 'Enter') { handleAdd('classifications', e.target.value); e.target.value=''; } }} />
                  <Button onClick={() => { const el = document.getElementById('newClassif'); handleAdd('classifications', el.value); el.value=''; }}><Plus size={18} /></Button>
                </div>
                {data.classifications.map(c => (
                  <div key={c.id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                    <input value={c.nom} onChange={(e) => handleRename('classifications', c.id, e.target.value)} className="font-medium outline-none bg-transparent" />
                    <button onClick={() => handleDelete('classifications', c.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>

              {/* GRILLES */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#3D8C70] uppercase tracking-wider">Grilles de Salaires</h3>
                  <Button onClick={handleAddGrid} variant="secondary" className="text-xs py-1"><Plus size={14}/> Ajouter</Button>
                </div>
                
                <div className="space-y-6">
                  {data.grids.map((grid) => (
                    <div key={grid.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                        <input value={grid.title} onChange={(e) => handleGridTitleChange(grid.id, e.target.value)} className="flex-1 font-bold text-[#252322] bg-transparent outline-none focus:underline" placeholder="Titre de la grille" />
                        <select 
                          value={grid.classificationId} 
                          onChange={(e) => handleGridClassifChange(grid.id, e.target.value)}
                          className="text-xs bg-gray-100 rounded px-2 py-1 border-none outline-none text-gray-600"
                        >
                          {data.classifications.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                        <button onClick={() => handleDelete('grids', grid.id)} className="text-gray-300 hover:text-red-500 ml-2"><Trash2 size={14} /></button>
                      </div>

                      <div className="space-y-2">
                        {grid.levels.map((level, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm group">
                            <input value={level.name} onChange={(e) => handleGridLevelChange(grid.id, idx, 'name', e.target.value)} className="w-24 text-gray-500 bg-transparent outline-none" />
                            <div className="flex-1 flex items-center gap-1 bg-gray-50 px-2 rounded border focus-within:border-[#3D8C70]">
                              <input type="number" value={level.threshold} onChange={(e) => handleGridLevelChange(grid.id, idx, 'threshold', e.target.value)} className="w-full bg-transparent outline-none py-1" />
                              <Euro size={12} className="text-gray-400" />
                            </div>
                            {/* Delete Level Button */}
                            <button onClick={() => handleDeleteGridLevel(grid.id, idx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        {/* Add Level Button */}
                        <div className="pt-2 flex justify-center">
                            <button onClick={() => handleAddGridLevel(grid.id)} className="text-xs text-[#3D8C70] hover:underline flex items-center gap-1 font-medium">
                                <Plus size={12} /> Ajouter un niveau
                            </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* GENERIC LISTS (Agences, Postes...) */}
              <div className="flex gap-2 mb-6">
                <input id="newItem" type="text" placeholder="Nouvelle entrée..." className="flex-1 px-3 py-2 border rounded-lg" onKeyDown={(e) => { if(e.key === 'Enter') { handleAdd(activeTab, e.target.value, activeTab === 'contrats' ? {requiresEndDate: false} : {}); e.target.value=''; } }} />
                <Button onClick={() => { const el = document.getElementById('newItem'); handleAdd(activeTab, el.value, activeTab === 'contrats' ? {requiresEndDate: false} : {}); el.value=''; }}><Plus size={18} /></Button>
              </div>
              <div className="space-y-3">
                {data[activeTab].map(item => (
                  <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2 group">
                    <input value={item.nom} onChange={(e) => handleRename(activeTab, item.id, e.target.value)} className="flex-1 bg-transparent font-medium outline-none" />
                    {activeTab === 'contrats' && (
                      <label className="flex items-center gap-2 text-xs text-gray-500"><input type="checkbox" checked={item.requiresEndDate} onChange={() => setData(prev => ({...prev, contrats: prev.contrats.map(c => c.id === item.id ? {...c, requiresEndDate: !c.requiresEndDate} : c)}))} /> Fin obligatoire</label>
                    )}
                    <button onClick={() => handleDelete(activeTab, item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---

export default function RainetteApp() {
  const [data, setData] = useState({
    employees: [],
    agences: [],
    postes: [],
    contrats: [],
    classifications: [],
    grids: []
  });
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ agenceId: '', posteId: '', contratTypeId: '', gridId: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'asc' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setData(JSON.parse(saved)); } catch (e) { console.error(e); }
    } else {
      // INIT DEFAULT DATA IF NOT SAVED
      // Migration initiale: assigner une grille à chaque employé
      const employees = RAW_EMPLOYEES.sort((a, b) => a.nom.localeCompare(b.nom)).map((e, i) => {
        // Logique d'assignation automatique de la grille par défaut
        let gridId = 'g_ce'; // Par défaut CE
        if (e.posteId === 'direction' || e.posteId === 'resp-agence' || e.posteId === 'resp-secteur') gridId = 'g_cadre';
        else if (e.posteId === 'chef-projet') gridId = 'g_cdp';
        
        return {
          id: String(i + 1), 
          ...e, 
          contratTypeId: 'cdi', 
          dateEntree: '2024-01-01', 
          dateSortie: '', 
          actif: true, 
          createdAt: Date.now(), 
          gridId: gridId, // Nouvelle propriété clé
          salaire: 0
        };
      });

      setData({
        employees,
        agences: [
          {id:'jenlain',nom:'Jenlain'}, {id:'st-omer',nom:'St-Omer'}, {id:'pompey',nom:'Pompey'}, {id:'colmar',nom:'Colmar'},
          {id:'caen',nom:'Caen'}, {id:'rouen',nom:'Rouen'}, {id:'toulouse',nom:'Toulouse'}, {id:'bordeaux',nom:'Bordeaux'},
          {id:'cesson',nom:'Cesson'}, {id:'macon',nom:'Mâcon'}, {id:'aix',nom:'Aix-en-Provence'}, {id:'le-mans',nom:'Le Mans'},
          {id:'default',nom:'Non assigné'}
        ],
        postes: [
          {id:'direction',nom:'Direction'}, {id:'resp-secteur',nom:'Responsable secteur'}, {id:'resp-agence',nom:'Responsable d\'agence'},
          {id:'chef-projet',nom:'Chef de projet'}, {id:'ce-faune',nom:'Chargé d\'études faune'}, {id:'ce-flore',nom:'Chargé d\'études flore et habitats'},
          {id:'ce-pedo',nom:'Chargé d\'études pédo'}, {id:'ce-hydro',nom:'Chargé d\'études hydro'}, {id:'ce-chiro',nom:'Chargé d\'études chiro'},
          {id:'default',nom:'Non renseigné'}
        ],
        contrats: [
          {id:'cdi',nom:'CDI',requiresEndDate:false}, {id:'cdd',nom:'CDD',requiresEndDate:true}, {id:'alternance',nom:'Alternance',requiresEndDate:true},
          {id:'stage',nom:'Stage',requiresEndDate:true}, {id:'freelance',nom:'Freelance',requiresEndDate:false}
        ],
        classifications: [
          {id:'ic', nom:'IC'}, {id:'etam', nom:'ETAM'}
        ],
        grids: DEFAULT_GRIDS_V8
      });
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)), 500);
  }, [data, loaded]);

  const handleUpdate = (id, field, val) => setData(prev => ({ ...prev, employees: prev.employees.map(e => e.id === id ? { ...e, [field]: val } : e) }));
  const handleAddEmp = () => {
    const newEmp = { 
      id: generateId(), prenom: '', nom: '', agenceId: 'default', posteId: 'default', contratTypeId: 'cdi', 
      gridId: data.grids[0]?.id || 'g_ce', salaire: 0,
      dateEntree: new Date().toISOString().split('T')[0], dateSortie: '', actif: true, createdAt: Date.now() 
    };
    setData(prev => ({ ...prev, employees: [...prev.employees, newEmp] }));
    setEditingId(newEmp.id); setEditForm(newEmp);
  };
  const handleDelEmp = (id) => setData(prev => ({ ...prev, employees: prev.employees.filter(e => e.id !== id) }));

  const startEdit = (e) => { setEditingId(e.id); setEditForm({...e}); };
  const saveEdit = () => {
    if (data.contrats.find(c => c.id === editForm.contratTypeId)?.requiresEndDate && !editForm.dateSortie) return alert("Date de sortie requise");
    setData(prev => ({ ...prev, employees: prev.employees.map(e => e.id === editingId ? { ...editForm, updatedAt: Date.now() } : e) }));
    setEditingId(null);
  };

  // --- STATS DYNAMIQUES ---
  const stats = useMemo(() => {
    const emps = data.employees;
    const total = emps.length;
    const avgYears = (emps.reduce((acc, curr) => acc + getDaysDiff(curr.dateEntree, curr.dateSortie), 0) / total / 365).toFixed(1);
    const departures = emps.filter(e => e.dateSortie && e.dateSortie >= new Date().toISOString().split('T')[0]).sort((a,b) => new Date(a.dateSortie) - new Date(b.dateSortie)).slice(0,3);
    
    const getCount = (filterFn) => emps.filter(filterFn).length;
    
    // Charts (Sorted DESC)
    const byAgency = data.agences.map((a, i) => ({ name: a.nom, value: getCount(e => e.agenceId === a.id), color: CHART_COLORS[i % CHART_COLORS.length] })).filter(x => x.value > 0).sort((a, b) => b.value - a.value);
    const byPoste = data.postes.map((p, i) => ({ name: p.nom, value: getCount(e => e.posteId === p.id), color: CHART_COLORS[i % CHART_COLORS.length] })).filter(x => x.value > 0).sort((a, b) => b.value - a.value);
    const byContrat = data.contrats.map((c, i) => ({ name: c.nom, value: getCount(e => e.contratTypeId === c.id), color: CHART_COLORS[i % CHART_COLORS.length] })).filter(x => x.value > 0).sort((a, b) => b.value - a.value);

    // REMUNERATION DYNAMIQUE (Basé sur les grilles)
    const gridStats = data.grids.map(grid => {
      // Employés appartenant à cette grille
      const gridEmps = emps.filter(e => e.gridId === grid.id);
      
      // Répartition par niveau
      const levelCounts = {};
      gridEmps.forEach(e => {
        const lvl = getLevel(e.salaire, grid);
        levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
      });
      
      // Trier les niveaux (du plus élevé au plus bas pour l'affichage)
      const sortedLevels = [...grid.levels].reverse().map(l => ({
        label: l.name,
        count: levelCounts[l.name] || 0
      }));
      // Ajouter hors grille s'il y en a
      if (levelCounts["Hors grille (< Min)"]) sortedLevels.push({ label: "Hors grille (< Min)", count: levelCounts["Hors grille (< Min)"] });

      // Salaire moyen
      const salariedEmps = gridEmps.filter(e => e.salaire > 0);
      const avgSalary = salariedEmps.length > 0 ? Math.round(salariedEmps.reduce((sum, e) => sum + e.salaire, 0) / salariedEmps.length) : 0;

      return {
        id: grid.id,
        title: grid.title,
        color: grid.id.includes('cadre') ? '#1D4A3B' : grid.id.includes('cdp') ? '#3D8C70' : '#82BAA3', // Couleur approximative pour le visuel
        stats: sortedLevels.filter(l => l.count > 0),
        avgSalary
      };
    });

    return { total, avgYears, departures, byAgency, byPoste, byContrat, gridStats };
  }, [data]);

  const filteredEmployees = useMemo(() => {
    let result = data.employees;
    if (searchTerm) result = result.filter(e => e.nom.toLowerCase().includes(searchTerm.toLowerCase()) || e.prenom.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filters.agenceId) result = result.filter(e => e.agenceId === filters.agenceId);
    if (filters.posteId) result = result.filter(e => e.posteId === filters.posteId);
    if (filters.contratTypeId) result = result.filter(e => e.contratTypeId === filters.contratTypeId);
    if (filters.gridId) result = result.filter(e => e.gridId === filters.gridId);
    
    return result.sort((a, b) => {
      let valA = a[sortConfig.key], valB = b[sortConfig.key];
      if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
      return (valA < valB ? -1 : 1) * (sortConfig.direction === 'asc' ? 1 : -1);
    });
  }, [data.employees, searchTerm, filters, sortConfig]);

  if (!loaded) return <div className="min-h-screen flex items-center justify-center bg-[#F2F2F2] text-[#3D8C70]">Chargement Rainette...</div>;

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-[Poppins] text-[#252322] pb-20">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'); body { font-family: 'Poppins', sans-serif; }`}</style>
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-md border-b border-white/50 shadow-sm h-16 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#3D8C70] flex items-center justify-center text-white shadow-md"><User size={20} /></div>
          <h1 className="text-xl font-bold text-[#3D8C70]">Rainette <span className="text-gray-500 font-normal text-sm">| Suivi de collaborateurs</span></h1>
        </div>
        <Button variant="ghost" icon={Settings} onClick={() => setIsSettingsOpen(true)}>Réglages</Button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* DASHBOARD - ROW 1 & 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-[#3D8C70] justify-center"><div className="flex items-end justify-between"><div><p className="text-sm font-medium text-gray-500">Actifs</p><h2 className="text-4xl font-bold mt-1">{stats.total}</h2></div><Users className="text-[#3D8C70]/20" size={48} /></div></Card>
          <Card className="justify-center"><div className="flex items-end justify-between"><div><p className="text-sm font-medium text-gray-500">Ancienneté moyenne</p><div className="text-4xl font-bold mt-1">{stats.avgYears} <span className="text-base font-normal text-gray-400">ans</span></div></div><Clock className="text-[#3D8C70]/20" size={48} /></div></Card>
          <Card className="col-span-1">
            <div className="flex items-end justify-between h-full">
              <div className="flex-1 w-full">
                <p className="text-sm font-medium text-gray-500 mb-3">Prochains Départs</p>
                <div className="space-y-2">
                  {stats.departures.length > 0 ? stats.departures.map(d => (
                    <div key={d.id} className="flex items-center gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                      <div className="flex-1 truncate font-medium">{d.prenom} {d.nom}</div>
                      <div className="text-xs text-gray-500 bg-white/50 px-1.5 py-0.5 rounded">{formatDate(d.dateSortie)}</div>
                    </div>
                  )) : <div className="text-sm text-gray-400 italic">Aucun départ prévu</div>}
                </div>
              </div>
              <LogOut className="text-[#3D8C70]/20 mb-1 shrink-0" size={48} />
            </div>
          </Card>
          
          <Card title="Répartition Postes" icon={Briefcase}><InteractivePieChart data={stats.byPoste} /></Card>
          <Card title="Répartition Contrats" icon={FileText}><InteractivePieChart data={stats.byContrat} /></Card>
          <Card title="Répartition par Agences" icon={MapPin}><InteractivePieChart data={stats.byAgency} /></Card>
        </div>

        {/* DASHBOARD - ROW 3: REMUNERATION DYNAMIQUE */}
        <Card title="Répartition & Moyennes Salariales" icon={BarChart3} className="min-h-[200px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            
            {/* GAUCHE: REPARTITION PAR NIVEAU */}
            <div className="space-y-6">
              <div className={`grid grid-cols-${Math.min(stats.gridStats.length, 3)} gap-4 text-sm`}>
                {stats.gridStats.map((gridStat, idx) => (
                  <div key={gridStat.id}>
                    <h4 className="font-bold mb-2 border-b pb-1" style={{ color: gridStat.color }}>{gridStat.title}</h4>
                    <div className="space-y-1">
                      {gridStat.stats.map(s => <div key={s.label} className="flex justify-between"><span>{s.label}</span><Badge customColor={gridStat.color}>{s.count}</Badge></div>)}
                      {gridStat.stats.length===0 && <span className="text-xs text-gray-400 italic">Aucune donnée</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DROITE: MOYENNES SALAIRES */}
            <div className="flex flex-col justify-center gap-4 border-l pl-8 border-gray-100">
              {stats.gridStats.map((gridStat) => (
                <div key={gridStat.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: `${gridStat.color}10`, borderColor: `${gridStat.color}20` }}>
                  <span className="font-medium text-gray-700">Salaire moyen {gridStat.title}</span>
                  <span className="text-xl font-bold" style={{ color: gridStat.color }}>{formatEuro(gridStat.avgSalary)}</span>
                </div>
              ))}
            </div>

          </div>
        </Card>

        {/* FILTERS */}
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          <div className="relative w-full lg:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-1.5 bg-[#F2F2F2] rounded-lg outline-none focus:bg-white border border-transparent focus:border-[#3D8C70] text-sm" />
          </div>
          <div className="flex flex-wrap lg:flex-nowrap gap-2 items-center w-full lg:w-auto">
            <Filter size={16} className="text-gray-400 mr-1" />
            <select className="bg-[#F2F2F2] text-xs py-1.5 px-2.5 rounded-lg border-none outline-none" value={filters.agenceId} onChange={e => setFilters(p => ({...p, agenceId: e.target.value}))}><option value="">Agences</option>{data.agences.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}</select>
            <select className="bg-[#F2F2F2] text-xs py-1.5 px-2.5 rounded-lg border-none outline-none" value={filters.posteId} onChange={e => setFilters(p => ({...p, posteId: e.target.value}))}><option value="">Postes</option>{data.postes.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}</select>
            <select className="bg-[#F2F2F2] text-xs py-1.5 px-2.5 rounded-lg border-none outline-none" value={filters.contratTypeId} onChange={e => setFilters(p => ({...p, contratTypeId: e.target.value}))}><option value="">Contrats</option>{data.contrats.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}</select>
            <select className="bg-[#F2F2F2] text-xs py-1.5 px-2.5 rounded-lg border-none outline-none" value={filters.gridId} onChange={e => setFilters(p => ({...p, gridId: e.target.value}))}><option value="">Grilles</option>{data.grids.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}</select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                  {[ {k:'nom',l:'Collaborateur'}, {k:'agenceId',l:'Agence'}, {k:'posteId',l:'Poste'}, {k:'contratTypeId',l:'Contrat'}, {k:'dateEntree',l:'Entrée'}, {k:'dateSortie',l:'Sortie'}, {k:'gridId',l:'Grille / Statut'}, {k:'salaire',l:'Salaire'}, {k:'actions',l:''} ].map(h => (
                    <th key={h.k} className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => h.k !== 'actions' && setSortConfig({ key: h.k, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}><div className="flex items-center gap-1">{h.l} {sortConfig.key === h.k && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}</div></th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredEmployees.map(emp => {
                  const isEditing = editingId === emp.id;
                  const reqEnd = data.contrats.find(c => c.id === (isEditing ? editForm.contratTypeId : emp.contratTypeId))?.requiresEndDate;
                  
                  // Récupération de la grille et classification pour affichage
                  const empGrid = data.grids.find(g => g.id === (isEditing ? editForm.gridId : emp.gridId));
                  const empClassif = data.classifications.find(c => c.id === empGrid?.classificationId);

                  return (
                    <tr key={emp.id} className={`group hover:bg-gray-50 transition-colors ${isEditing ? 'bg-green-50/30' : ''}`} onClick={() => !isEditing && startEdit(emp)} onKeyDown={e => { if(isEditing && e.key === 'Enter') saveEdit(); }}>
                      <td className="p-4">{isEditing ? <div className="flex gap-2"><input autoFocus className="w-24 p-1 border rounded bg-white" value={editForm.prenom} onChange={e => setEditForm({...editForm, prenom:e.target.value})} /><input className="w-28 p-1 border rounded bg-white font-bold" value={editForm.nom} onChange={e => setEditForm({...editForm, nom:e.target.value})} /></div> : <div><div className="font-semibold text-[#252322]">{emp.nom} {emp.prenom}</div></div>}</td>
                      <td className="p-4">{isEditing ? <select className="w-full p-1 border rounded bg-white" value={editForm.agenceId} onChange={e => setEditForm({...editForm, agenceId:e.target.value})}>{data.agences.map(o => <option key={o.id} value={o.id}>{o.nom}</option>)}</select> : <Badge>{data.agences.find(a => a.id === emp.agenceId)?.nom}</Badge>}</td>
                      <td className="p-4">{isEditing ? <select className="w-full p-1 border rounded bg-white" value={editForm.posteId} onChange={e => setEditForm({...editForm, posteId:e.target.value})}>{data.postes.map(o => <option key={o.id} value={o.id}>{o.nom}</option>)}</select> : <span>{data.postes.find(p => p.id === emp.posteId)?.nom}</span>}</td>
                      <td className="p-4">{isEditing ? <select className="w-full p-1 border rounded bg-white" value={editForm.contratTypeId} onChange={e => setEditForm({...editForm, contratTypeId:e.target.value})}>{data.contrats.map(o => <option key={o.id} value={o.id}>{o.nom}</option>)}</select> : <Badge color={emp.contratTypeId === 'cdi' ? 'green' : 'blue'}>{data.contrats.find(c => c.id === emp.contratTypeId)?.nom}</Badge>}</td>
                      <td className="p-4 text-gray-600">{isEditing ? <input type="date" className="border rounded p-1" value={editForm.dateEntree} onChange={e => setEditForm({...editForm, dateEntree:e.target.value})} /> : formatDate(emp.dateEntree)}</td>
                      <td className="p-4 text-gray-600">{isEditing ? <input type="date" disabled={!reqEnd} className={`border rounded p-1 ${!reqEnd ? 'bg-gray-100' : ''}`} value={editForm.dateSortie} onChange={e => setEditForm({...editForm, dateSortie:e.target.value})} /> : (emp.dateSortie ? formatDate(emp.dateSortie) : '-')}</td>
                      
                      {/* COLONNE: GRILLE (qui déduit le Statut) */}
                      <td className="p-4">
                        {isEditing ? (
                          <select className="w-full p-1 border rounded bg-white" value={editForm.gridId} onChange={e => setEditForm({...editForm, gridId:e.target.value})}>
                            {data.grids.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                          </select>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-medium text-[#3D8C70] text-xs">{empGrid?.title}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wide">{empClassif?.nom}</span>
                          </div>
                        )}
                      </td>
                      
                      {/* COLONNE: SALAIRE */}
                      <td className="p-4 font-mono text-gray-700">{isEditing ? <input type="number" className="w-24 p-1 border rounded bg-white text-right" value={editForm.salaire} onChange={e => setEditForm({...editForm, salaire:Number(e.target.value)})} /> : formatEuro(emp.salaire)}</td>
                      
                      <td className="p-4 text-right min-w-[100px]">{isEditing ? <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}><button onClick={saveEdit} className="p-1.5 bg-[#3D8C70] text-white rounded hover:scale-105"><Save size={14} /></button><button onClick={() => setEditingId(null)} className="p-1.5 bg-gray-200 text-gray-600 rounded hover:scale-105"><X size={14} /></button></div> : <div className="flex justify-end opacity-0 group-hover:opacity-100" onClick={e => e.stopPropagation()}><button onClick={() => handleDelEmp(emp.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button></div>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center"><Button onClick={handleAddEmp} icon={Plus}>Ajouter un collaborateur</Button></div>
        </div>
      </main>
      <AdminPanel data={data} setData={setData} isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}