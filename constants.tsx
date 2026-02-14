
import { Stop } from './types';

export const INITIAL_STOPS: Stop[] = [
  {
    id: 1,
    location: "The Ark, Totnes",
    postcode: "TQ9 5SN",
    theme: "Love (The Quirky Start)",
    activity: "Kick off the mission in Totnes. This independent shop is a Jellycat haven. Find your first 'Heart' mascot amidst the most unique high street in Devon. Aesthetic: Retro-cool.",
    travelTime: "45 mins from Start",
    jellycatStockist: true,
    type: 'Start'
  },
  {
    id: 2,
    location: "Strawberry Fields, Lifton",
    postcode: "PL16 0DE",
    theme: "Friendship (The Harvest Lunch)",
    activity: "Lunch time! This award-winning farm shop on the Devon/Cornwall border is legendary for its local produce and incredible pies. Grab a big family table and fuel up.",
    travelTime: "45 mins from Totnes",
    jellycatStockist: false,
    type: 'Lunch'
  },
  {
    id: 3,
    location: "The Little Toy Shop, Launceston",
    postcode: "PL15 8BA",
    theme: "Appreciation (The Border Crossing)",
    activity: "Just minutes into Cornwall! This independent gem is a premier destination for Jellycat collectors. Track down the heart-shaped prizes in the shadow of the medieval castle.",
    travelTime: "10 mins from Lifton",
    jellycatStockist: true,
    type: 'Treat'
  },
  {
    id: 4,
    location: "Greendale Farm Shop, Farringdon",
    postcode: "EX5 1DQ",
    theme: "Connection (The Sweetest Finale)",
    activity: "The final mission on the way back to Ottery. Visit the massive Jellycat emporium for the final prize, then head to the cafe for award-winning local ice cream and milkshakes. Mission accomplished!",
    travelTime: "50 mins from Launceston",
    jellycatStockist: true,
    type: 'Final'
  }
];
