// Ensure global Skills object exists
window.Skills = window.Skills || {};

window.Skills.Fireball = function(card, placedCards, db, lobbyId) {
  const splashRadius = 100; // radius in pixels for splash effect
  const splashDamage = card.damage || 50; // damage amount

  // Find enemy cards within splashRadius
  const enemiesInRange = placedCards.filter(c => 
    c.owner !== card.owner && 
    c.hp > 0 &&
    Math.hypot(c.x - card.x, c.y - card.y) <= splashRadius
  );

  enemiesInRange.forEach(enemy => {
    const newHp = Math.max(0, enemy.hp - splashDamage);
    // Update enemy HP in Firestore
    db.collection("lobbies").doc(lobbyId).collection("placements").doc(enemy.id)
      .update({ hp: newHp })
      .catch(console.error);
  });

  console.log(`Fireball cast by ${card.id}, hit ${enemiesInRange.length} enemies for ${splashDamage} damage.`);
}
