export const CURRENT_USER_ID = 'u0'

export const demoUsers = [
  { id:'u0', username:'you', name:'You', avatar:'https://picsum.photos/seed/you/200/200', bio:'Capturing moments ✨ | InstaPulse explorer', verified:false, following:[ 'u1','u2','u3','u5'], followers:[] },
  { id:'u1', username:'maya.travels', name:'Maya Chen', avatar:'https://picsum.photos/seed/maya/200/200', bio:'Travel photographer 🌍', verified:true, following:[], followers:[] },
  { id:'u2', username:'alexcreates', name:'Alex Rivera', avatar:'https://picsum.photos/seed/alex/200/200', bio:'Designer & maker', verified:false, following:[], followers:[] },
  { id:'u3', username:'sofia.eats', name:'Sofia Patel', avatar:'https://picsum.photos/seed/sofia/200/200', bio:'Food lover 🍜', verified:false, following:[], followers:[] },
  { id:'u4', username:'kenji.photo', name:'Kenji Tanaka', avatar:'https://picsum.photos/seed/kenji/200/200', bio:'Street photography 📸 Tokyo', verified:true, following:[], followers:[] },
  { id:'u5', username:'luna.art', name:'Luna Park', avatar:'https://picsum.photos/seed/luna/200/200', bio:'Digital artist', verified:false, following:[], followers:[] },
  { id:'u6', username:'marcus.fit', name:'Marcus Lee', avatar:'https://picsum.photos/seed/marcus/200/200', bio:'Fitness coach 💪', verified:false, following:[], followers:[] },
  { id:'u7', username:'nina.wild', name:'Nina Wilder', avatar:'https://picsum.photos/seed/nina/200/200', bio:'Wildlife & nature', verified:true, following:[], followers:[] },
  { id:'u8', username:'ethan.codes', name:'Ethan Cole', avatar:'https://picsum.photos/seed/ethan/200/200', bio:'Indie hacker', verified:false, following:[], followers:[] },
  { id:'u9', username:'zara.style', name:'Zara Ahmed', avatar:'https://picsum.photos/seed/zara/200/200', bio:'Minimal style', verified:false, following:[], followers:[] },
  { id:'u10', username:'oliver.plants', name:'Oliver Green', avatar:'https://picsum.photos/seed/oliver/200/200', bio:'Plant dad 🌿', verified:false, following:[], followers:[] },
  { id:'u11', username:'chloe.sea', name:'Chloe Kim', avatar:'https://picsum.photos/seed/chloe/200/200', bio:'Ocean vibes', verified:false, following:[], followers:[] },
]

export const demoPosts = [
  { id:'p1', userId:'u1', image:`https://picsum.photos/seed/p1/800/800`, caption:'Sunset over Kyoto temples 🏯 #travel #japan #sunset', location:'Kyoto, Japan', likes:['u2','u3','u4','u5','u6'], comments:[{id:'c1', userId:'u2', text:'Stunning shot!', createdAt: Date.now()- 1000*60*12}], createdAt: Date.now()-1000*60*30, aspect:'square' },
  { id:'p2', userId:'u2', image:`https://picsum.photos/seed/p2/800/1000`, caption:'New workspace setup — minimal, calm, productive. #design #workspace', location:'Brooklyn, NY', likes:['u0','u1','u3'], comments:[], createdAt: Date.now()-1000*60*60*2, aspect:'portrait' },
  { id:'p3', userId:'u3', image:`https://picsum.photos/seed/p3/800/800`, caption:'Homemade ramen night 🍜 Recipe in comments! #food #homemade', location:'Osaka', likes:['u1','u4','u0','u7'], comments:[{id:'c2', userId:'u0', text:'Looks delicious! 😍', createdAt: Date.now()-1000*60*50}], createdAt: Date.now()-1000*60*60*5, aspect:'square' },
  { id:'p4', userId:'u4', image:`https://picsum.photos/seed/p4/800/600`, caption:'Rainy Shibuya crossing. #street #tokyo #rain', location:'Shibuya, Tokyo', likes:['u0','u1','u5','u6','u7','u8'], comments:[], createdAt: Date.now()-1000*60*60*8, aspect:'landscape' },
  { id:'p5', userId:'u5', image:`https://picsum.photos/seed/p5/800/1000`, caption:'Dreamscape series #03 — digital painting. #art #digitalart', location:'', likes:['u2','u3','u9'], comments:[], createdAt: Date.now()-1000*60*60*10, aspect:'portrait' },
  { id:'p6', userId:'u6', image:`https://picsum.photos/seed/p6/800/800`, caption:'Morning run complete ✅ 10k in the bag #fitness #running', location:'Central Park', likes:['u7','u8'], comments:[], createdAt: Date.now()-1000*60*60*12, aspect:'square' },
  { id:'p7', userId:'u7', image:`https://picsum.photos/seed/p7/800/800`, caption:'Majestic elephant in the wild #wildlife #nature #safari', location:'Kenya', likes:['u0','u1','u2','u3','u4','u5','u6','u7','u8','u9'], comments:[{id:'c3', userId:'u7', text:'Shot on 400mm', createdAt: Date.now()- 1000*60*60*13}], createdAt: Date.now()-1000*60*60*14, aspect:'square' },
  { id:'p8', userId:'u8', image:`https://picsum.photos/seed/p8/800/600`, caption:'Shipping a tiny product today. Iteration > perfection. #buildinpublic #code', location:'San Francisco', likes:['u2','u5'], comments:[], createdAt: Date.now()-1000*60*60*18, aspect:'landscape' },
  { id:'p9', userId:'u9', image:`https://picsum.photos/seed/p9/800/1000`, caption:'Autumn layers. Beige, cream, and coffee. #style #minimal #ootd', location:'Paris', likes:['u3','u11','u0'], comments:[], createdAt: Date.now()-1000*60*60*20, aspect:'portrait' },
  { id:'p10', userId:'u10', image:`https://picsum.photos/seed/p10/800/800`, caption:'Monstera Monday 🌱 new leaf unfolding #plants #greenthumb', location:'', likes:['u11','u1'], comments:[], createdAt: Date.now()-1000*60*60*22, aspect:'square' },
  { id:'p11', userId:'u11', image:`https://picsum.photos/seed/p11/800/600`, caption:'Golden hour at the beach. #ocean #sunset #california', location:'Malibu', likes:['u1','u9','u10'], comments:[], createdAt: Date.now()-1000*60*60*24, aspect:'landscape' },
  { id:'p12', userId:'u1', image:`https://picsum.photos/seed/p12/800/800`, caption:'Kyoto morning market finds #travel #kyoto', location:'Kyoto', likes:['u0','u2'], comments:[], createdAt: Date.now()-1000*60*60*26, aspect:'square' },
  { id:'p13', userId:'u4', image:`https://picsum.photos/seed/p13/800/800`, caption:'Neon nights in Shinjuku #tokyo #neon #streetphotography', location:'Shinjuku', likes:['u5','u6','u8'], comments:[], createdAt: Date.now()-1000*60*60*28, aspect:'square' },
  { id:'p14', userId:'u2', image:`https://picsum.photos/seed/p14/800/800`, caption:'Poster design exploration — feedback welcome! #design', location:'', likes:['u0','u5','u9'], comments:[], createdAt: Date.now()-1000*60*60*30, aspect:'square' },
  { id:'p15', userId:'u3', image:`https://picsum.photos/seed/p15/800/800`, caption:'Matcha and mochi perfect afternoon #food #japan', location:'Kyoto', likes:['u1','u4'], comments:[], createdAt: Date.now()-1000*60*60*32, aspect:'square' },
  { id:'p16', userId:'u5', image:`https://picsum.photos/seed/p16/800/800`, caption:'Celestial Dreams ✨ new print drop #art', location:'', likes:['u2','u8','u0'], comments:[], createdAt: Date.now()-1000*60*60*34, aspect:'square' },
]

export const demoStories = demoUsers.slice(1,9).map((u, idx)=> ({
  id: `s${idx+1}`,
  userId: u.id,
  image: `https://picsum.photos/seed/story${idx+1}/720/1280`,
  createdAt: Date.now() - 1000*60*60*idx,
  viewed: false
}))

export const demoReels = [
  { id:'r1', userId:'u1', video:'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', caption:'Morning hike 🌄 #travel', likes:['u0','u2'], comments:[{id:'rc1', userId:'u2', text:'Wow!'}], thumb:`https://picsum.photos/seed/reel1/600/900` },
  { id:'r2', userId:'u4', video:'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', caption:'Tokyo streets at night #tokyo', likes:['u3'], comments:[], thumb:`https://picsum.photos/seed/reel2/600/900` },
  { id:'r3', userId:'u7', video:'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', caption:'Safari magic 🦁', likes:['u0','u1','u2','u3'], comments:[], thumb:`https://picsum.photos/seed/reel3/600/900` },
  { id:'r4', userId:'u6', video:'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', caption:'Leg day 🔥', likes:[], comments:[], thumb:`https://picsum.photos/seed/reel4/600/900` },
  { id:'r5', userId:'u9', video:'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', caption:'OOTD transition', likes:['u5'], comments:[], thumb:`https://picsum.photos/seed/reel5/600/900` },
  { id:'r6', userId:'u3', video:'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', caption:'Cooking time 🍳', likes:['u1'], comments:[], thumb:`https://picsum.photos/seed/reel6/600/900` },
]

export const demoConversations = [
  { id:'c1', participants:['u0','u1'], messages:[
    { id:'m1', senderId:'u1', text:'Hey! Loved your recent post 😍', createdAt: Date.now()-1000*60*60*5, read:true },
    { id:'m2', senderId:'u0', text:'Thank you Maya! Means a lot', createdAt: Date.now()-1000*60*60*4, read:true },
    { id:'m3', senderId:'u1', text:'We should collab sometime!', createdAt: Date.now()-1000*60*30, read:false },
  ]},
  { id:'c2', participants:['u0','u2'], messages:[
    { id:'m4', senderId:'u2', text:'Check this design 👀', createdAt: Date.now()-1000*60*60*8, read:true },
    { id:'m5', senderId:'u0', text:'So clean!', createdAt: Date.now()-1000*60*60*7, read:true },
  ]},
  { id:'c3', participants:['u0','u4'], messages:[
    { id:'m6', senderId:'u4', text:'Shot on film 🎞️', createdAt: Date.now()-1000*60*60*20, read:false },
  ]},
  { id:'c4', participants:['u0','u7'], messages:[
    { id:'m7', senderId:'u7', text:'Safari photos are up!', createdAt: Date.now()-1000*60*60*26, read:false },
  ]},
  { id:'c5', participants:['u0','u9'], messages:[
    { id:'m8', senderId:'u9', text:'Love your style!', createdAt: Date.now()-1000*60*60*30, read:true },
  ]},
]

export const demoNotifications = [
  { id:'n1', type:'like', userId:'u1', postId:'p2', createdAt: Date.now()-1000*60*5, read:false },
  { id:'n2', type:'comment', userId:'u2', postId:'p1', text:'Stunning shot!', createdAt: Date.now()-1000*60*12, read:false },
  { id:'n3', type:'follow', userId:'u7', createdAt: Date.now()-1000*60*60*2, read:false },
  { id:'n4', type:'like', userId:'u4', postId:'p3', createdAt: Date.now()-1000*60*60*5, read:true },
  { id:'n5', type:'comment', userId:'u3', postId:'p6', text:'Great run!', createdAt: Date.now()-1000*60*60*8, read:true },
  { id:'n6', type:'like', userId:'u9', postId:'p10', createdAt: Date.now()-1000*60*60*10, read:false },
  { id:'n7', type:'follow', userId:'u5', createdAt: Date.now()-1000*60*60*12, read:true },
  { id:'n8', type:'like', userId:'u6', postId:'p1', createdAt: Date.now()-1000*60*60*15, read:true },
]

export const exploreCategories = ['All','Travel','Design','Food','Art','Nature','Style']
