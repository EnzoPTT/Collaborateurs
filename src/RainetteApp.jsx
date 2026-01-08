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
  Clock
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

// Nouvelle palette : 6 nuances de vert pour les graphiques
const CHART_COLORS = [
  '#1D4A3B', // 1. Vert Profond (Plus foncé)
  '#2C6652', // 2. Vert Foncé
  '#3D8C70', // 3. Vert Rainette (Principal)
  '#5DA389', // 4. Vert Moyen
  '#82BAA3', // 5. Vert Clair
  '#A8D1C0', // 6. Vert Pâle (Plus clair)
];

// Changement de version pour forcer la mise à jour des données (v5)
const STORAGE_KEY = 'rainette_rh_hub_v5';

// --- DONNÉES BRUTES IMPORTÉES & TRIÉES ---
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
  // Équipes
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
  { nom: "Cobigo", prenom: "Maxime", agenceId: "cesson", posteId: "resp-agence" },
  { nom: "Barbolla", prenom: "Lucie", agenceId: "cesson", posteId: "chef-projet" },
  { nom: "Menauge", prenom: "Ronan", agenceId: "cesson", posteId: "chef-projet" },
  { nom: "Poirier", prenom: "Gwendal", agenceId: "cesson", posteId: "ce-faune" },
  { nom: "Luu", prenom: "Nathan", agenceId: "cesson", posteId: "ce-faune" },
  { nom: "Lequitte", prenom: "Tristan", agenceId: "cesson", posteId: "ce-faune" },
  { nom: "Perrachon", prenom: "Nathan", agenceId: "cesson", posteId: "ce-flore" },
  { nom: "Clisson", prenom: "Valentin", agenceId: "cesson", posteId: "ce-flore" },
  { nom: "Dutrey", prenom: "Damien", agenceId: "cesson", posteId: "ce-flore" },
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
  { nom: "Avrillon", prenom: "Hugo", agenceId: "macon", posteId: "chef-projet" },
  { nom: "Mollot", prenom: "Romain", agenceId: "macon", posteId: "ce-faune" },
  { nom: "Leproux", prenom: "Clarysse", agenceId: "macon", posteId: "ce-flore" },
  { nom: "Imbrosciano", prenom: "Carine", agenceId: "aix", posteId: "resp-agence" },
  { nom: "Picot", prenom: "Ines", agenceId: "aix", posteId: "ce-faune" },
  { nom: "Lubert", prenom: "Ronan", agenceId: "le-mans", posteId: "ce-faune" },
  { nom: "Fournier", prenom: "Maureen", agenceId: "le-mans", posteId: "ce-flore" },
];

// Tri Alphabétique (Nom puis Prénom)
const SORTED_EMPLOYEES = RAW_EMPLOYEES.sort((a, b) => {
  const nameA = a.nom.toLowerCase();
  const nameB = b.nom.toLowerCase();
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  // Si même nom, tri par prénom
  const prenomA = a.prenom.toLowerCase();
  const prenomB = b.prenom.toLowerCase();
  if (prenomA < prenomB) return -1;
  if (prenomA > prenomB) return 1;
  return 0;
}).map((emp, index) => ({
  id: String(index + 1),
  ...emp,
  contratTypeId: 'cdi', // Défaut CDI
  dateEntree: '2024-01-01', // Date par défaut
  dateSortie: '',
  actif: true,
  createdAt: Date.now()
}));

const INITIAL_DATA = {
  employees: SORTED_EMPLOYEES,
  agences: [
    { id: 'jenlain', nom: 'Jenlain' },
    { id: 'st-omer', nom: 'St-Omer' },
    { id: 'pompey', nom: 'Pompey' },
    { id: 'colmar', nom: 'Colmar' },
    { id: 'caen', nom: 'Caen' },
    { id: 'rouen', nom: 'Rouen' },
    { id: 'toulouse', nom: 'Toulouse' },
    { id: 'bordeaux', nom: 'Bordeaux' },
    { id: 'cesson', nom: 'Cesson' },
    { id: 'macon', nom: 'Mâcon' },
    { id: 'aix', nom: 'Aix-en-Provence' },
    { id: 'le-mans', nom: 'Le Mans' },
    { id: 'default', nom: 'Non assigné' }, 
  ],
  postes: [
    { id: 'direction', nom: 'Direction' },
    { id: 'resp-secteur', nom: 'Responsable secteur' },
    { id: 'resp-agence', nom: "Responsable d'agence" },
    { id: 'chef-projet', nom: 'Chef de projet' },
    { id: 'ce-faune', nom: "Chargé d'études faune" },
    { id: 'ce-flore', nom: "Chargé d'études flore et habitats" },
    { id: 'ce-pedo', nom: "Chargé d'études pédo" },
    { id: 'ce-hydro', nom: "Chargé d'études hydro" },
    { id: 'ce-chiro', nom: "Chargé d'études chiro" },
    { id: 'default', nom: 'Non renseigné' },
  ],
  contrats: [
    { id: 'cdi', nom: 'CDI', requiresEndDate: false },
    { id: 'cdd', nom: 'CDD', requiresEndDate: true },
    { id: 'alternance', nom: 'Alternance', requiresEndDate: true },
    { id: 'stage', nom: 'Stage', requiresEndDate: true },
    { id: 'freelance', nom: 'Freelance', requiresEndDate: false },
  ]
};

// --- UTILITAIRES ---

const generateId = () => Math.random().toString(36).substr(2, 9);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getDaysDiff = (start, end) => {
  const d1 = new Date(start);
  const d2 = end ? new Date(end) : new Date();
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
};

// --- COMPOSANTS UI GÉNÉRIQUES ---

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

const Badge = ({ children, color = 'gray' }) => {
  const styles = {
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    green: 'bg-[#3D8C70]/10 text-[#3D8C70] border-[#3D8C70]/20',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${styles[color] || styles.gray}`}>
      {children}
    </span>
  );
};

const Button = ({ children, onClick, variant = 'primary', icon: Icon, className = '', disabled = false }) => {
  const baseStyle = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-[#3D8C70] text-white hover:bg-[#2e6b55] shadow-md shadow-[#3D8C70]/20",
    secondary: "bg-white text-[#252322] border border-gray-200 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    ghost: "text-gray-500 hover:text-[#3D8C70] hover:bg-[#3D8C70]/5",
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

// --- PIE CHART SVG INTERACTIF ---
const InteractivePieChart = ({ data }) => {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  if (total === 0) return (
    <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
      Aucune donnée
    </div>
  );

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
            
            // Si c'est 100%, cercle complet
            if (slice.value / total === 1) {
              return (
                <circle 
                  key={i} 
                  cx="0" 
                  cy="0" 
                  r="1" 
                  fill={slice.color} 
                  onMouseEnter={() => setHoveredSlice(slice)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              );
            }

            const pathData = [
              `M 0 0`,
              `L ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `Z`,
            ].join(' ');

            return (
              <path 
                key={i} 
                d={pathData} 
                fill={slice.color} 
                stroke="white" 
                strokeWidth="0.02"
                className="transition-all duration-200 hover:opacity-90 cursor-pointer"
                style={{
                  transform: hoveredSlice?.name === slice.name ? 'scale(1.05)' : 'scale(1)',
                  transformOrigin: 'center'
                }}
                onMouseEnter={() => setHoveredSlice(slice)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            );
          })}
        </svg>
        
        {/* Central Overlay for Value */}
        {hoveredSlice && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-lg text-center transform scale-110 transition-transform z-10">
              <div className="text-lg font-bold text-[#3D8C70]">{hoveredSlice.value}</div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-1 min-w-[120px]">
        {data.map((slice, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-between text-xs transition-opacity ${hoveredSlice && hoveredSlice.name !== slice.name ? 'opacity-30' : 'opacity-100'}`}
            onMouseEnter={() => setHoveredSlice(slice)}
            onMouseLeave={() => setHoveredSlice(null)}
          >
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

// --- COMPOSANT ADMIN (DÉPLACÉ HORS DE LA BOUCLE DE RENDU PRINCIPALE) ---

const AdminPanel = ({ data, setData, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('agences');
  
  // Generic handlers for dictionaries
  const handleRename = (collection, id, newName) => {
    setData(prev => ({
      ...prev,
      [collection]: prev[collection].map(item => item.id === id ? { ...item, nom: newName } : item)
    }));
  };

  const handleAdd = (collection, name, extra = {}) => {
    if (!name.trim()) return;
    const newItem = { id: generateId(), nom: name, ...extra };
    setData(prev => ({ ...prev, [collection]: [...prev[collection], newItem] }));
  };

  const handleDeleteDict = (collection, id) => {
    const currentList = data[collection];
    
    // Determine fallback: Try 'default' first (if it's not the deleted one), else first available
    let fallbackItem = currentList.find(i => i.id === 'default' && i.id !== id);
    if (!fallbackItem) {
      fallbackItem = currentList.find(i => i.id !== id);
    }
    const fallbackId = fallbackItem ? fallbackItem.id : null; 

    // SUPPRESSION IMMÉDIATE SANS CONFIRMATION
    setData(prev => {
      // 1. Reassign employees (Silent repair)
      const updatedEmployees = prev.employees.map(e => {
        if (!fallbackId) return e; 
        if (collection === 'agences' && e.agenceId === id) return { ...e, agenceId: fallbackId };
        if (collection === 'postes' && e.posteId === id) return { ...e, posteId: fallbackId };
        if (collection === 'contrats' && e.contratTypeId === id) return { ...e, contratTypeId: fallbackId }; 
        return e;
      });
      // 2. Remove from dictionary
      return {
        ...prev,
        employees: updatedEmployees,
        [collection]: prev[collection].filter(i => i.id !== id)
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F2F2F2]">
          <h2 className="text-xl font-bold text-[#252322]">Réglages</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex border-b border-gray-200">
          {['agences', 'postes', 'contrats'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-[#3D8C70] text-[#3D8C70]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#F2F2F2]">
          {/* ADD NEW */}
          <div className="mb-6 flex gap-2">
            <input 
              id="newItemInput" 
              type="text" 
              placeholder="Nouvelle entrée..." 
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3D8C70] outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                   handleAdd(activeTab, e.target.value, activeTab === 'contrats' ? { requiresEndDate: false } : {});
                   e.target.value = '';
                }
              }}
            />
            <Button onClick={() => {
              const input = document.getElementById('newItemInput');
              handleAdd(activeTab, input.value, activeTab === 'contrats' ? { requiresEndDate: false } : {});
              input.value = '';
            }}><Plus size={18} /></Button>
          </div>

          {/* LIST */}
          <div className="space-y-3">
            {data[activeTab].map(item => (
              <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2 group">
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={item.nom} 
                    onChange={(e) => handleRename(activeTab, item.id, e.target.value)}
                    className="w-full bg-transparent font-medium text-[#252322] focus:underline outline-none"
                  />
                  {activeTab === 'contrats' && (
                    <label className="flex items-center gap-2 mt-1 text-xs text-gray-500 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={item.requiresEndDate}
                        onChange={() => {
                          setData(prev => ({
                            ...prev,
                            contrats: prev.contrats.map(c => c.id === item.id ? { ...c, requiresEndDate: !c.requiresEndDate } : c)
                          }))
                        }}
                      />
                      Date de fin obligatoire
                    </label>
                  )}
                </div>
                
                <button 
                  onClick={() => handleDeleteDict(activeTab, item.id)} 
                  className="text-gray-400 hover:text-red-500 p-2"
                  title="Supprimer immédiatement"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---

export default function RainetteApp() {
  // --- STATE ---
  const [data, setData] = useState(INITIAL_DATA);
  const [loaded, setLoaded] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ agenceId: '', posteId: '', contratTypeId: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'asc' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID de la ligne en cours d'édition
  const [editForm, setEditForm] = useState({}); // Données temporaires d'édition

  // --- PERSISTENCE ---

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration simple si besoin, ici on charge direct
        setData(parsed);
      } catch (e) {
        console.error("Erreur lecture sauvegarde", e);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    
    const handler = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLastSaved(new Date());
    }, 500); // Debounce 500ms

    return () => clearTimeout(handler);
  }, [data, loaded]);

  // --- LOGIC: DATA MANAGEMENT ---

  const handleUpdateEmployee = (id, field, value) => {
    setData(prev => ({
      ...prev,
      employees: prev.employees.map(emp => emp.id === id ? { ...emp, [field]: value, updatedAt: Date.now() } : emp)
    }));
  };

  const handleAddEmployee = () => {
    const newEmp = {
      id: generateId(),
      prenom: '',
      nom: '',
      agenceId: data.agences[0]?.id || 'default', // Fallback to first available agency
      posteId: data.postes[0]?.id || 'default', // Fallback to first available role
      contratTypeId: 'cdi',
      dateEntree: new Date().toISOString().split('T')[0],
      dateSortie: '',
      actif: true,
      createdAt: Date.now()
    };
    setData(prev => ({ ...prev, employees: [...prev.employees, newEmp] }));
    startEditing(newEmp); // Auto start edit
  };

  const handleDeleteEmployee = (id) => {
    // SUPPRESSION IMMÉDIATE SANS CONFIRMATION
    setData(prev => ({ ...prev, employees: prev.employees.filter(e => e.id !== id) }));
  };

  // --- LOGIC: EDITING ---

  const startEditing = (emp) => {
    setEditingId(emp.id);
    setEditForm({ ...emp });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEditing = () => {
    // Check date logic
    const contract = data.contrats.find(c => c.id === editForm.contratTypeId);
    if (contract?.requiresEndDate && !editForm.dateSortie) {
      alert("La date de sortie est obligatoire pour ce type de contrat.");
      return;
    }
    if (editForm.dateSortie && editForm.dateSortie < editForm.dateEntree) {
      alert("La date de sortie ne peut pas être antérieure à la date d'entrée.");
      return;
    }

    setData(prev => ({
      ...prev,
      employees: prev.employees.map(e => e.id === editingId ? { ...editForm, updatedAt: Date.now() } : e)
    }));
    setEditingId(null);
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  // --- LOGIC: KPIS ---

  const stats = useMemo(() => {
    const activeEmployees = data.employees;
    
    // 1. Total
    const total = activeEmployees.length;

    // 2. Par Agence
    const byAgency = data.agences
      .filter(a => a.id !== 'default')
      .map(agency => ({
        name: agency.nom,
        count: activeEmployees.filter(e => e.agenceId === agency.id).length
      }))
      .sort((a, b) => b.count - a.count);

    // 3. Par Poste (Pour Graphique)
    const byRole = data.postes
      .filter(p => p.id !== 'default')
      .map((role, index) => ({
        name: role.nom,
        value: activeEmployees.filter(e => e.posteId === role.id).length,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    // 4. Par Contrat (Pour Graphique)
    const byContract = data.contrats.map((c, index) => ({
      name: c.nom,
      value: activeEmployees.filter(e => e.contratTypeId === c.id).length,
      color: CHART_COLORS[index % CHART_COLORS.length] 
    })).filter(item => item.value > 0);

    // 5. Ancienneté
    const totalDays = activeEmployees.reduce((acc, curr) => acc + getDaysDiff(curr.dateEntree, curr.dateSortie), 0);
    const avgDays = total > 0 ? Math.floor(totalDays / total) : 0;
    const avgYears = (avgDays / 365).toFixed(1);

    // 6. Prochains départs (avec date de sortie future)
    const today = new Date().toISOString().split('T')[0];
    const departures = activeEmployees
      .filter(e => e.dateSortie && e.dateSortie >= today)
      .sort((a, b) => new Date(a.dateSortie) - new Date(b.dateSortie))
      .slice(0, 3);

    return { total, byAgency, byRole, byContract, avgYears, departures };
  }, [data]);

  // --- LOGIC: FILTERING & SORTING ---

  const filteredEmployees = useMemo(() => {
    let result = data.employees;

    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(e => 
        e.nom.toLowerCase().includes(lower) || 
        e.prenom.toLowerCase().includes(lower)
      );
    }

    // Filters
    if (filters.agenceId) result = result.filter(e => e.agenceId === filters.agenceId);
    if (filters.posteId) result = result.filter(e => e.posteId === filters.posteId);
    if (filters.contratTypeId) result = result.filter(e => e.contratTypeId === filters.contratTypeId);

    // Sort
    result.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Gestion spécifique des dates et strings
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [data.employees, searchTerm, filters, sortConfig]);

  // --- RENDER ---

  if (!loaded) return <div className="min-h-screen flex items-center justify-center bg-[#F2F2F2] text-[#3D8C70]">Chargement Rainette...</div>;

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-[Poppins] text-[#252322] pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Poppins', sans-serif; }
        .glass-panel { background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-30 glass-panel shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3D8C70] flex items-center justify-center text-white shadow-md shadow-[#3D8C70]/30">
              <User size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#3D8C70]">Rainette <span className="text-gray-500 font-normal text-sm">| Suivi de collaborateurs</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
             <Button variant="ghost" icon={Settings} onClick={() => setIsSettingsOpen(true)}>Réglages</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* DASHBOARD - GRID LAYOUT 2 LIGNES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* LIGNE 1 */}
          
          {/* KPI 1: HEADCOUNT */}
          <Card className="col-span-1 border-l-4 border-l-[#3D8C70] justify-center">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Collaborateurs Actifs</p>
                <h2 className="text-4xl font-bold text-[#252322] mt-1">{stats.total}</h2>
              </div>
              <Users className="text-[#3D8C70]/20 mb-1" size={48} />
            </div>
          </Card>

          {/* KPI 2: ANCIENNETÉ */}
          <Card className="col-span-1 justify-center">
             <div className="flex items-end justify-between">
                <div>
                   <p className="text-sm font-medium text-gray-500">Ancienneté Moyenne</p>
                   <div className="text-4xl font-bold text-[#252322] mt-1">{stats.avgYears} <span className="text-base font-normal text-gray-400">ans</span></div>
                </div>
                <Clock className="text-[#3D8C70]/20 mb-1" size={48} />
             </div>
          </Card>

          {/* KPI 3: UPCOMING DEPARTURES */}
          <Card title="Prochains Départs" icon={AlertCircle} className="col-span-1">
             <div className="space-y-3 mt-1 flex-1">
               {stats.departures.length > 0 ? stats.departures.map(d => (
                 <div key={d.id} className="flex items-center gap-3 text-sm">
                   <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                   <div className="flex-1 truncate font-medium">{d.prenom} {d.nom}</div>
                   <div className="text-xs text-gray-500 bg-white/50 px-1.5 py-0.5 rounded">{formatDate(d.dateSortie)}</div>
                 </div>
               )) : <div className="text-sm text-gray-400 italic">Aucun départ prévu</div>}
             </div>
          </Card>

          {/* LIGNE 2 */}

          {/* KPI 4: REPARTITION POSTES */}
          <Card title="Répartition par Poste" icon={Briefcase} className="col-span-1">
             <InteractivePieChart data={stats.byRole} />
          </Card>

          {/* KPI 5: REPARTITION CONTRATS */}
          <Card title="Répartition par Contrat" icon={FileText} className="col-span-1">
             <InteractivePieChart data={stats.byContract} />
          </Card>

           {/* KPI 6: BY AGENCY */}
           <Card title="Répartition Agences" icon={MapPin} className="col-span-1">
             <div className="space-y-2 mt-1 overflow-y-auto max-h-[120px] pr-2 scrollbar-thin">
               {stats.byAgency.map((a, i) => (
                 <div key={i} className="flex justify-between items-center text-sm">
                   <span className="truncate">{a.name}</span>
                   <Badge color="green">{a.count}</Badge>
                 </div>
               ))}
               {stats.byAgency.length === 0 && <span className="text-xs text-gray-400 italic">Aucune donnée</span>}
             </div>
          </Card>

        </div>

        {/* FILTERS BAR */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3D8C70] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un collaborateur..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F2F2F2] border-transparent focus:bg-white border focus:border-[#3D8C70] rounded-lg outline-none transition-all"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            <Filter size={16} className="text-gray-400 mr-1" />
            
            <select 
              className="bg-[#F2F2F2] text-sm py-2 px-3 rounded-lg border-none outline-none focus:ring-1 focus:ring-[#3D8C70]"
              value={filters.agenceId}
              onChange={(e) => setFilters(prev => ({ ...prev, agenceId: e.target.value }))}
            >
              <option value="">Toutes agences</option>
              {data.agences.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
            </select>

            <select 
              className="bg-[#F2F2F2] text-sm py-2 px-3 rounded-lg border-none outline-none focus:ring-1 focus:ring-[#3D8C70]"
              value={filters.posteId}
              onChange={(e) => setFilters(prev => ({ ...prev, posteId: e.target.value }))}
            >
              <option value="">Tous postes</option>
              {data.postes.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
            </select>

            <select 
              className="bg-[#F2F2F2] text-sm py-2 px-3 rounded-lg border-none outline-none focus:ring-1 focus:ring-[#3D8C70]"
              value={filters.contratTypeId}
              onChange={(e) => setFilters(prev => ({ ...prev, contratTypeId: e.target.value }))}
            >
              <option value="">Tous contrats</option>
              {data.contrats.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  {[
                    { key: 'nom', label: 'Collaborateur' },
                    { key: 'agenceId', label: 'Agence' },
                    { key: 'posteId', label: 'Poste' },
                    { key: 'contratTypeId', label: 'Contrat' },
                    { key: 'dateEntree', label: 'Entrée' },
                    { key: 'dateSortie', label: 'Sortie' },
                    { key: 'actions', label: '' }
                  ].map(h => (
                    <th key={h.key} className="p-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => h.key !== 'actions' && setSortConfig({ key: h.key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                      <div className="flex items-center gap-1">
                        {h.label}
                        {sortConfig.key === h.key && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredEmployees.map(emp => {
                  const isEditing = editingId === emp.id;
                  const currentContract = data.contrats.find(c => c.id === (isEditing ? editForm.contratTypeId : emp.contratTypeId));
                  const requiresEnd = currentContract?.requiresEndDate;

                  return (
                    <tr 
                      key={emp.id} 
                      className={`group hover:bg-gray-50 transition-colors ${isEditing ? 'bg-green-50/30' : ''}`}
                      onClick={() => !isEditing && startEditing(emp)}
                    >
                      {/* NOM / PRENOM */}
                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex gap-2">
                             <input 
                                autoFocus
                                className="w-24 p-1 border rounded bg-white" 
                                value={editForm.prenom} 
                                onChange={(e) => handleEditChange('prenom', e.target.value)} 
                                placeholder="Prénom"
                                onClick={(e) => e.stopPropagation()}
                              />
                             <input 
                                className="w-28 p-1 border rounded bg-white font-bold" 
                                value={editForm.nom} 
                                onChange={(e) => handleEditChange('nom', e.target.value)} 
                                placeholder="Nom"
                                onClick={(e) => e.stopPropagation()}
                              />
                          </div>
                        ) : (
                          <div>
                            <div className="font-semibold text-[#252322]">{emp.nom} {emp.prenom}</div>
                          </div>
                        )}
                      </td>

                      {/* AGENCE */}
                      <td className="p-4">
                        {isEditing ? (
                           <select 
                            className="w-full p-1 border rounded bg-white"
                            value={editForm.agenceId}
                            onChange={(e) => handleEditChange('agenceId', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                           >
                             {data.agences.map(opt => <option key={opt.id} value={opt.id}>{opt.nom}</option>)}
                           </select>
                        ) : (
                          <Badge color="gray">{data.agences.find(a => a.id === emp.agenceId)?.nom || '?'}</Badge>
                        )}
                      </td>

                      {/* POSTE */}
                      <td className="p-4">
                        {isEditing ? (
                           <select 
                            className="w-full p-1 border rounded bg-white"
                            value={editForm.posteId}
                            onChange={(e) => handleEditChange('posteId', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                           >
                             {data.postes.map(opt => <option key={opt.id} value={opt.id}>{opt.nom}</option>)}
                           </select>
                        ) : (
                          <span className="text-gray-700">{data.postes.find(p => p.id === emp.posteId)?.nom || '?'}</span>
                        )}
                      </td>

                      {/* CONTRAT */}
                      <td className="p-4">
                        {isEditing ? (
                           <select 
                            className="w-full p-1 border rounded bg-white"
                            value={editForm.contratTypeId}
                            onChange={(e) => handleEditChange('contratTypeId', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                           >
                             {data.contrats.map(opt => <option key={opt.id} value={opt.id}>{opt.nom}</option>)}
                           </select>
                        ) : (
                          <Badge color={emp.contratTypeId === 'cdi' ? 'green' : 'blue'}>
                            {data.contrats.find(c => c.id === emp.contratTypeId)?.nom || '?'}
                          </Badge>
                        )}
                      </td>

                      {/* DATE ENTREE */}
                      <td className="p-4 text-gray-600">
                         {isEditing ? (
                           <input 
                            type="date" 
                            className="border rounded p-1 text-xs" 
                            value={editForm.dateEntree} 
                            onChange={(e) => handleEditChange('dateEntree', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                           />
                         ) : formatDate(emp.dateEntree)}
                      </td>

                      {/* DATE SORTIE */}
                      <td className="p-4 text-gray-600">
                         {isEditing ? (
                           <input 
                            type="date" 
                            disabled={!requiresEnd}
                            className={`border rounded p-1 text-xs ${!requiresEnd ? 'bg-gray-100 text-gray-300' : ''}`}
                            value={editForm.dateSortie} 
                            onChange={(e) => handleEditChange('dateSortie', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                           />
                         ) : (emp.dateSortie ? formatDate(emp.dateSortie) : '-')}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button onClick={saveEditing} className="p-1.5 bg-[#3D8C70] text-white rounded hover:scale-105"><Save size={14} /></button>
                            <button onClick={cancelEditing} className="p-1.5 bg-gray-200 text-gray-600 rounded hover:scale-105"><X size={14} /></button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                             <button onClick={() => handleDeleteEmployee(emp.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded" title="Supprimer immédiatement">
                                <Trash2 size={16} />
                             </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredEmployees.length === 0 && (
                   <tr><td colSpan="7" className="p-8 text-center text-gray-400">Aucun collaborateur trouvé.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center">
            <Button onClick={handleAddEmployee} icon={Plus}>Ajouter un collaborateur</Button>
          </div>
        </div>

      </main>

      {isSettingsOpen && <AdminPanel data={data} setData={setData} isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}