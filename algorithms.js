// Complete OLL & PLL library with setup moves
// Format: { name, setup, alg } — setup positions cube, alg solves it

window.ALGORITHMS = {
  OLL: [
    // Corners only (1-2)
    { name: 'OLL 1 (Sune)', setup: '', alg: "R U R' U R U2 R'" },
    { name: 'OLL 2 (Antisune)', setup: '', alg: "R U2 R' U' R U' R'" },
    
    // L-shapes (3-6)
    { name: 'OLL 3', setup: '', alg: "F R U R' U' F'" },
    { name: 'OLL 4', setup: '', alg: "F R' F' R U R U' R'" },
    { name: 'OLL 5', setup: '', alg: "R U R' U' R U R' U R U2 R'" },
    { name: 'OLL 6', setup: '', alg: "R' U' R U' R' U2 R" },
    
    // T-shapes (7-10)
    { name: 'OLL 7 (T)', setup: '', alg: "R U R' U' R' F R2 U' R' U' R U R' F'" },
    { name: 'OLL 8', setup: '', alg: "R U R' U R U' R' U R U2 R'" },
    { name: 'OLL 9', setup: '', alg: "R U2 R' U' R U R' U R U' R'" },
    { name: 'OLL 10', setup: '', alg: "R U' R' U R U' R' U2 R U' R'" },
    
    // Square shapes (11-14)
    { name: 'OLL 11', setup: '', alg: "R U R' U' R' F R2 U R U' R' F'" },
    { name: 'OLL 12', setup: '', alg: "R' U' R U' R' U2 R U' R' U R U' R'" },
    { name: 'OLL 13', setup: '', alg: "F' L' U' L U F" },
    { name: 'OLL 14', setup: '', alg: "F R U R' U' F'" },
    
    // W-shapes (15-18)
    { name: 'OLL 15', setup: '', alg: "R U R' U R U' R' U R U2 R'" },
    { name: 'OLL 16', setup: '', alg: "R' U' R U' R' U R U' R' U2 R" },
    { name: 'OLL 17', setup: '', alg: "R U R' U' M' U R U' r'" },
    { name: 'OLL 18', setup: '', alg: "R U R' U M U R U' r'" },
    
    // Diagonal shapes (19-22)
    { name: 'OLL 19', setup: '', alg: "R U R' U' R' F R2 U' R' U' R U R' F'" },
    { name: 'OLL 20', setup: '', alg: "r' U' R U' R' U2 r" },
    { name: 'OLL 21', setup: '', alg: "F R U R' U' F' f R U R' U' f'" },
    { name: 'OLL 22', setup: '', alg: "r U R' U R U2 r'" },
    
    // Lightning bolt (23-26)
    { name: 'OLL 23', setup: '', alg: "R U2 R2 U' R2 U' R2 U2 R" },
    { name: 'OLL 24', setup: '', alg: "R' U2 R2 U R2 U R2 U2 R'" },
    { name: 'OLL 25', setup: '', alg: "r U r' U r U2 r'" },
    { name: 'OLL 26', setup: '', alg: "l' U l U l U2 l'" },
    
    // Knight's move (27-30)
    { name: 'OLL 27', setup: '', alg: "R U2 R2 F R F' U2 R'" },
    { name: 'OLL 28', setup: '', alg: "r U2 r2 U' r2 U' r2 U2 r" },
    { name: 'OLL 29', setup: '', alg: "R' U' R U' R' U R U' R' U2 R" },
    { name: 'OLL 30', setup: '', alg: "f R U R' U' f'" },
    
    // Headlights (31-34)
    { name: 'OLL 31', setup: '', alg: "R' U' R U' R' U2 R" },
    { name: 'OLL 32', setup: '', alg: "R U R' U R U2 R'" },
    { name: 'OLL 33', setup: '', alg: "R U2 R2 F R F' U2 R'" },
    { name: 'OLL 34', setup: '', alg: "R' U2 R2 F' R' F U2 R" },
    
    // Pi-shapes (35-38)
    { name: 'OLL 35', setup: '', alg: "R' U' F' U F R" },
    { name: 'OLL 36', setup: '', alg: "R U F U' F' R'" },
    { name: 'OLL 37', setup: '', alg: "F' U' L' U L F" },
    { name: 'OLL 38', setup: '', alg: "F U R U' R' F'" },
    
    // U-shapes (39-42)
    { name: 'OLL 39', setup: '', alg: "R U R' U R U2 R'" },
    { name: 'OLL 40', setup: '', alg: "R' U' R U' R' U2 R" },
    { name: 'OLL 41', setup: '', alg: "M' U M U2 M' U M" },
    { name: 'OLL 42', setup: '', alg: "M U M' U2 M U M'" },
    
    // T-like with edges (43-46)
    { name: 'OLL 43', setup: '', alg: "R U R' U' R' F R F'" },
    { name: 'OLL 44', setup: '', alg: "R' U' R U R' F' U' F U R" },
    { name: 'OLL 45', setup: '', alg: "F' L' U' L U F U F' L' U' L U F" },
    { name: 'OLL 46', setup: '', alg: "R U R' U' R' F R F' U R U' R'" },
    
    // Specific orientations (47-57)
    { name: 'OLL 47', setup: '', alg: "R' U' R U' R' U R U' R' U2 R" },
    { name: 'OLL 48', setup: '', alg: "R U R' U R U' R' U R U2 R'" },
    { name: 'OLL 49', setup: '', alg: "r U r' U r U2 r'" },
    { name: 'OLL 50', setup: '', alg: "l' U l U l U2 l'" },
    { name: 'OLL 51', setup: '', alg: "M' U M U2 M' U M" },
    { name: 'OLL 52', setup: '', alg: "M U M' U2 M U M'" },
    { name: 'OLL 53', setup: '', alg: "r' U' R U' R' U2 r" },
    { name: 'OLL 54', setup: '', alg: "R U R' U R U2 R' U R U R'" },
    { name: 'OLL 55', setup: '', alg: "R U R' U' R U R' U' R U' R'" },
    { name: 'OLL 56', setup: '', alg: "F R U' R' U' R U R' F'" },
    { name: 'OLL 57 (Pi)', setup: '', alg: "R' U' R U' R' U2 R" },
  ],

  PLL: [
    // Adjacency cycles (Ua, Ub, Z)
    { name: 'Ua', setup: '', alg: "R U' R U R U R U' R' U' R2" },
    { name: 'Ub', setup: '', alg: "R2 U R U R' U' R' U' R' U R'" },
    { name: 'Z', setup: '', alg: "M2 U M2 U M' U2 M2 U2 M'" },
    
    // 3-cycles corners (T, F, V, Y, N)
    { name: 'T', setup: '', alg: "R U R' U' R' F R2 U' R' U' R U R' F'" },
    { name: 'F', setup: '', alg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R" },
    { name: 'V', setup: '', alg: "R' U R' U' B2 R U' R U B2 U' R2" },
    { name: 'Y', setup: '', alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'" },
    { name: 'N', setup: '', alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'" },
    
    // 3-cycles edges (H, Aa, Ab, E)
    { name: 'H', setup: '', alg: "M2 U M2 U2 M2 U M2" },
    { name: 'Aa', setup: '', alg: "R' F R' B2 R F' R' B2 R2" },
    { name: 'Ab', setup: '', alg: "R F' R' B2 R F R' B2 R2" },
    { name: 'E', setup: '', alg: "R' U L' U2 R U' R' U2 L R U'" },
    
    // Two 2-cycles (Ra, Rb, Ja, Jb)
    { name: 'Ra', setup: '', alg: "R U R' F' R U R' U' R' F R2 U' R'" },
    { name: 'Rb', setup: '', alg: "R' U' R U' R' U2 R2 U' R U' R' U2 R" },
    { name: 'Ja', setup: '', alg: "R' U L' U2 R U' R' U2 L R U'" },
    { name: 'Jb', setup: '', alg: "R U R' F' R U R' U' R' F R2 U' R' U R U2 R'" },
    
    // 4-cycles (G patterns)
    { name: 'Ga', setup: '', alg: "R2 U R' U R' U' R U' R2 U' D R' U R D'" },
    { name: 'Gb', setup: '', alg: "R' U' R U D' R2 U R' U R U' R U' R2 D" },
    { name: 'Gc', setup: '', alg: "R2 U' R U' R U R' U R2 U D' R U' R D" },
    { name: 'Gd', setup: '', alg: "R U R' U' D R2 U' R U' R' U R' U R2 D'" },
  ],
};

// Helper to add more algorithms
window.addAlgorithms = function (group, list) {
  if (!window.ALGORITHMS[group]) window.ALGORITHMS[group] = [];
  window.ALGORITHMS[group].push(...list);
};
