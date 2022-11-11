const express = require('express');
const mongoose = require("mongoose");
var cors = require('cors')
const app = express();
app.use(cors())

mongoose.connect("mongodb+srv://testing:testing1234@cluster0.caphnxp.mongodb.net/TestDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db = mongoose.connection

// async function connection(collectionName) {
//     await mongoose.connect("mongodb+srv://testing:testing1234@cluster0.caphnxp.mongodb.net/TestDB", {useNewUrlParser: true, useUnifiedTopology: true,});
//     const db = await mongoose.connection;  
//     var data =  db.collection(collectionName).find()
//     console.log(await data.toArray())
// }

// connection("_User")

// All Endpoints
app.get("/getallendpoints", (req, res) => {
    let endpointsList = [
        {Key:"Interaction", Value : "Interactions (add total shares, likes, views, audio listens numbers)" },
        {Key:"NewUserAcquisition", Value : "New user acquisition" },
        {Key:"LikeContent", Value : "Total Likes Content Count" },
        {Key:"Share", Value : "Shares" },
        {Key:"NumberOfSearches", Value : "Number of searches" },
        {Key:"ArticleRead", Value : "Article reads" },
        {Key:"TopVideos", Value : "Top Videos" },
        {Key:"TopArticleRead", Value : "Top 5 articles read (En+Ar inclusive)" },
        {Key:"TopLikedContent", Value : "Top 5 Liked content"},
        {Key:"TopPopularTopics", Value : "(Top 5 most popular topics (based on articles, videos viewed) (En+Ar inclusive))" },
        {Key:"KeywordSearches", Value : "Top 5 keywords or phrases searched" },
        {Key:"ActiveUserByEngagement", Value : "Top 5 active users on the app (by engagement))" },
        {Key:"MostEngaging", Value : "Most Engaging" },
        {Key:"Favorited", Value : "(Top 5 favorited content)"},
        {Key:"TopContentShared", Value : "Top 5 content (both article + Videos) shared (En+Ar inclusive)" },
        {Key:"MostActiveTimeSlot", Value : "Most active time slots (top 3) "},
        {Key:"RelevantContent", Value : "How many people were looking for relevant content ?"},
]
    res.send({ endpoints: endpointsList })
})

// Number of searches
app.get("/NumberOfSearches/:month", async (req, res) => {

    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("UserSearches").aggregate([
        { "$match": {
            $or: [ { _created_at: {
                $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } }, { _updated_at: {
                    $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                    $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } } ] 
        }
        }
    ])

    var data = await query.toArray()
    res.send({ count: data.length });
})

// Top 5 keywords or phrases searched
app.get("/KeywordSearches/:month", async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("UserSearches").aggregate([
        { "$match": {
            $or: [ { _created_at: {
                $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } }, { _updated_at: {
                    $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                    $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } } ] 
        }
        },
        {"$group" : {_id:"$keyword", count:{$sum:1}}}
        ,
        { $sort: { count: -1 } }
        ,
        { $limit: 5 }
    ])

    var data = await query.toArray()
    res.send({ data: data });
})

// Interactions (add total shares, likes, views, audio listens numbers)
app.get('/Interaction/:month', async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("_User").aggregate([
        {
            "$match": {
                $or: [{
                    _created_at: {
                        $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                        $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                    }
                }]
            }
        }
    ])

    var data = await query.toArray()
    res.send({ count: data.length });
})

// New user acquisition
app.get('/NewUserAcquisition/:month', async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("UserActionLogs").aggregate([
        {
            "$match": {
                $or: [{
                    _created_at: {
                        $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                        $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                    }
                }, {
                    _updated_at: {
                        $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                        $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                    }
                }]
            }
        },
        {
            "$match": {
                $or: [{ "action": "share" }, { "action": "like" }, { "action": "view" }]
            }
        }
    ])

    var data = await query.toArray()
    res.send({ count: data.length });
})

// Total Likes Content Count
app.get('/LikeContent/:month', async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("UserActionLogs").aggregate([
        {
            "$match": {
                $or: [{
                    _created_at: {
                        $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                        $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                    }
                }, {
                    _updated_at: {
                        $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                        $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                    }
                }]
            }
        },
        {
            "$match": {
                $or: [{ "action": "like" }]
            }
        }
    ])

    var data = await query.toArray()
    res.send({ count: data.length });
})

// Shares
app.get('/Share/:month', async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("UserActionLogs").aggregate([
        {
            "$match": {
                $or: [{
                    _created_at: {
                        $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                        $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                    }
                }, {
                    _updated_at: {
                        $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                        $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                    }
                }]
            }
        },
        {
            "$match": {
                $or: [{ "action": "share" }]
            }
        }
    ])

    var data = await query.toArray()
    res.send({ count: data.length });
})

// Article reads
app.get('/ArticleRead/:month', async (req, res) => {
        const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("UserActionLogs").aggregate([
        {
            "$match": {
                $or: [{
                    _created_at: {
                        $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                        $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                    }
                }, {
                    _updated_at: {
                        $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                        $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                    }
                }]
            }
        },
        {
            "$match": {
                $or: [{ "action": "view" }]
            }
        }
    ])

    var data = await query.toArray()
    res.send({ count: data.length });
})

// Top 5 content (both article + Videos) shared (En+Ar inclusive)
app.get('/TopContentShared/:month', async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("News").distinct("_id", {})
    var data = await query
    let newData = []
    data.forEach((item, index) => {
        newData.push(`News$${data[index]}`)
    })

    const query2 = await db.collection("UserActionLogs").aggregate([
        {
            "$match": {
                $or: [{
                    _created_at: {
                        $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                        $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                    }
                }, {
                    _updated_at: {
                        $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                        $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                    }
                }]
            }
        },
        {
            "$match": {
                "_p_news": {
                    "$in": newData
                }
            }
        },
        {
            "$match": {
                "action": "share"
            }
        }
        ,
        { "$group": { _id: "$_p_news", count: { $sum: 1 } } }
        ,
        { $sort: { count: -1 } }
        ,
        { $limit: 5 }

    ])

    let data2 = await query2.toArray()
    let idArray = []

    data2.forEach((item, index) => {
        idArray.push(item._id.replace("News$", ""))
    })

    let query3 = db.collection("News").find(
        {
            "_id":
                { $in: idArray }
        }, { type: 1, title: 1, _id: 1 }
    )

    let dataArray = []
    let data3 = await query3.toArray()

    data3.forEach((item, index) => {
        dataArray.push({ id: item._id, title: item.title, type: item.type, count: data2[index].count })
    })

    res.send({ data: dataArray })
})

// Most active time slots (top 3) 
app.get("/MostActiveTimeSlot/:month", async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("News").distinct("_id", {})
    var data = await query
    let newData = []
    data.forEach((item, index) => {
        newData.push(`News$${data[index]}`)
    })

    const query2 = db.collection("UserActionLogs").aggregate([
        { "$match": {
            $or: [ { _created_at: {
                $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } } ] 
        }
        },
        { "$match": {
            "_p_news": { 
                "$in":  newData
            }
        } 
        },
       {
          $group: {
             _id: {
                year: { $year: "$_created_at" },
                month: { $month: "$_created_at" },
                day: { $dayOfMonth: "$_created_at" },
                hour: { $hour: "$_created_at" }
             },
             articleCountPerHour: { $sum: 1 }
          }
       },
       {
          $group: {
            "_id": "$_id.hour",
             noOfDays: { $sum: 1 }
          }
       },
       { "$sort": {  "noOfDays": -1 } }, //"countHour": -1, "year": -1, "month": -1, "day": 1, 
    ])

    let data2 = await query2.toArray()
    res.send({ data: data2 });
})

// Top Videos
app.get("/TopVideos/:month", async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("News").distinct("_id", { $or: [ { type: "video" } ] })
    var data = await query
    let newData = []
    data.forEach((item, index) => {
        newData.push(`News$${data[index]}`)
    })

    let query2 = await db.collection("UserActionLogs").aggregate([
        { "$match": {
            $or: [ { _created_at: {
                $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } }, { _updated_at: {
                    $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                    $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } } ] 
        }
        },
        { "$match": {
            "_p_news": { 
                "$in":  newData
            }
        } 
        },
        { "$match": {
            "action": "view"
        } 
        }
        ,
        {"$group" : {_id:"$_p_news", count:{$sum:1}}}
        ,
        { $sort: { count: -1 } }
        ,
        { $limit: 5 }
        
    ])

    let data2 = await query2.toArray()
    let idArray = []

    data2.forEach((item, index) => {
        idArray.push(item._id.replace("News$", ""))
    })

    let query3 =  db.collection("News").find(
        {
            "_id" :
        {$in :idArray} //"iiW4B1lNax", "GLY6tsTAE0", "eY4nEZ2K75", "SUbcuqgqBK", "euvEupQqp0", 
        } ,{title:1, type: 1, _id:1}
        )
       

    let dataArray = []
    let data3 = await query3.toArray()

    data3.forEach((item, index) => {
        dataArray.push({ id: item._id, title: item.title, type: item.type, count: data2[index].count })
    })

    res.send({ data: dataArray })

})

// (Top 5 most popular topics (based on articles, videos viewed) (En+Ar inclusive))
app.get("/TopPopularTopics/:month", async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("News").distinct("_id", { $or: [ { type: "video" } ] })
    var data = await query
    let newData = []
    data.forEach((item, index) => {
        newData.push(`News$${data[index]}`)
    })

    let query2 = await db.collection("UserActionLogs").aggregate([
        { "$match": {
            $or: [ { _created_at: {
                $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } }, { _updated_at: {
                    $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                    $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } } ] 
        }
        },
        { "$match": {
            "_p_news": { 
                "$in":  newData
            }
        } 
        },
        { "$match": {
            "action": "view"
        } 
        }
        ,
        {"$group" : {_id:"$_p_news", count:{$sum:1}}}
        ,
        { $sort: { count: -1 } }
        ,
        { $limit: 5 }
        
    ])

    let data2 = await query2.toArray()
    let idArray = []

    data2.forEach((item, index) => {
        idArray.push(item._id.replace("News$", ""))
    })

    let query3 =  db.collection("News").find(
        {
            "_id" :
        {$in :idArray} 
        } ,{title:1, type: 1, _id:1}
        )
       

    let dataArray = []
    let data3 = await query3.toArray()

    data3.forEach((item, index) => {
        dataArray.push({ id: item._id, title: item.title, type: item.type, count: data2[index].count })
    })

    res.send({ data: dataArray })
})

// Top 5 active users on the app (by engagement))
app.get("/ActiveUserByEngagement/:month", async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("_User").distinct("_id", {})
    var data = await query
    let newData = []
    data.forEach((item, index) => {
        newData.push(`News$${data[index]}`)
    })

    let query2 = await db.collection("UserActionLogs").aggregate([
        { "$match": {
            $or: [ { _created_at: {
                $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } }, { _updated_at: {
                    $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                    $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } } ] 
        }
        },
        { "$match": {
            "_p_user": { 
                "$in":  newData
            }
        } 
        },
        {"$group" : {_id:"$_p_user", count:{$sum:1}}}
        ,
        { $sort: { count: -1 } }
        ,
        { $limit: 5 }
        
    ])

    let data2 = await query2.toArray()
    let idArray = []

    data2.forEach((item, index) => {
        idArray.push(item._id.replace("News$", ""))
    })

    let query3 =   db.collection("_User").find(
        {
            "_id" :
        {$in : idArray}
        } ,{username:2, _id:1}
        )
       
       

    let dataArray = []
    let data3 = await query3.toArray()

    data3.forEach((item, index) => {
        dataArray.push({ id: item._id, title: item.title, type: item.type, count: data2[index].count })
    })

    res.send({ data: dataArray })
})

// Top 5 articles read (En+Ar inclusive)
app.get("/TopArticleRead/:month", async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("News").distinct("_id", { $or: [ { type: "articles" } ] })
    var data = await query
    let newData = []
    data.forEach((item, index) => {
        newData.push(`News$${data[index]}`)
    })

    let query2 = await db.collection("UserActionLogs").aggregate([
        { "$match": {
            $or: [ { _created_at: {
                $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } }, { _updated_at: {
                    $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                    $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } } ] 
        }
        },
        { "$match": {
            "_p_news": { 
                "$in":  newData
            }
        } 
        },
        { "$match": {
            "action": "view"
        } 
        }
        ,
        {"$group" : {_id:"$_p_news", count:{$sum:1}}}
        ,
        { $sort: { count: -1 } }
        ,
        { $limit: 5 }
        
    ])

    let data2 = await query2.toArray()
    let idArray = []

    data2.forEach((item, index) => {
        idArray.push(item._id.replace("News$", ""))
    })

    let query3 = db.collection("News").find(
        {
            "_id":
                { $in: idArray }
        }, { type: 1, title: 1, _id: 1 }
    )
       
    let dataArray = []
    let data3 = await query3.toArray()

    data3.forEach((item, index) => {
        dataArray.push({ id: item._id, title: item.title, type: item.type, count: data2[index].count })
    })

    res.send({ data: dataArray })
})

// Top 5 Liked content
app.get("/TopLikedContent/:month", async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("News").distinct("_id", {})
    var data = await query
    let newData = []
    data.forEach((item, index) => {
        newData.push(`News$${data[index]}`)
    })

    let query2 = await db.collection("UserActionLogs").aggregate([
        { "$match": {
            $or: [ { _created_at: {
                $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } }, { _updated_at: {
                    $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                    $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } } ] 
        }
        },
        { "$match": {
            "_p_news": { 
                "$in":  newData
    
            }
        } 
        },
        { "$match": {
            "action": "like"
        } 
        }
        ,
        {"$group" : {_id:"$_p_news", count:{$sum:1}}}
        ,
        { $sort: { count: -1 } }
        ,
        { $limit: 5 }
        
    ])

    let data2 = await query2.toArray()
    let idArray = []

    data2.forEach((item, index) => {
        idArray.push(item._id.replace("News$", ""))
    })

    let query3 = db.collection("News").find(
        {
            "_id":
                { $in: idArray }
        }, { type: 1, title: 1, _id: 1 }
    )
       
    let dataArray = []
    let data3 = await query3.toArray()

    data3.forEach((item, index) => {
        dataArray.push({ id: item._id, title: item.title, type: item.type, count: data2[index].count })
    })

    res.send({ data: dataArray })
})

// Most Engaging
app.get("/MostEngaging/:month", async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("News").distinct("_id", {})
    var data = await query
    let newData = []
    data.forEach((item, index) => {
        newData.push(`News$${data[index]}`)
    })

    let query2 = await db.collection("UserActionLogs").aggregate([
        { "$match": {
            $or: [ { _created_at: {
                $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } }, { _updated_at: {
                    $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                    $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } } ] 
        }
        },
        { "$match": {
            "_p_news": { 
                "$in": newData
            }
        } 
        },
        {"$group" : {_id:"$_p_news", count:{$sum:1}}}
        ,
        { $sort: { count: -1 } }
        ,
        { $limit: 5 }
        
    ])

    let data2 = await query2.toArray()
    let idArray = []

    data2.forEach((item, index) => {
        idArray.push(item._id.replace("News$", ""))
    })

    let query3 = db.collection("News").find(
        {
            "_id":
                { $in: idArray }
        }, { type: 1, title: 1, _id: 1 }
    )
       
    let dataArray = []
    let data3 = await query3.toArray()

    data3.forEach((item, index) => {
        dataArray.push({ id: item._id, title: item.title, type: item.type, count: data2[index].count })
    })

    res.send({ data: dataArray })
})

//  (Top 5 favorited content)
app.get("/Favorited/:month", async (req, res) => {
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    const query = await db.collection("News").distinct("_id", {})
    var data = await query
    let newData = []
    data.forEach((item, index) => {
        newData.push(`News$${data[index]}`)
    })

    let query2 = await db.collection("UserActionLogs").aggregate([
        { "$match": {
            $or: [ { _created_at: {
                $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } }, { _updated_at: {
                    $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                    $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                } } ] 
        }
        },
        { "$match": {
            "_p_news": { 
                "$in": newData
            }
        } 
        },
        { "$match": {
            "action": "bookmark"
        } 
        }
        ,
        {"$group" : {_id:"$_p_news", count:{$sum:1}}}
        ,
        { $sort: { count: -1 } }
        ,
        { $limit: 5 }
        
    ])

    let data2 = await query2.toArray()
    let idArray = []

    data2.forEach((item, index) => {
        idArray.push(item._id.replace("News$", ""))
    })

    let query3 = db.collection("News").find(
        {
            "_id":
                { $in: idArray }
        }, { type: 1, title: 1, _id: 1 }
    )
       
    let dataArray = []
    let data3 = await query3.toArray()

    data3.forEach((item, index) => {
        dataArray.push({ id: item._id, title: item.title, type: item.type, count: data2[index].count })
    })

    res.send({ data: dataArray })
})

//  How many people were looking for relevant content ?
app.get("/RelevantContent/:month", async (req, res) => {
    let contentType = ["spotlightbyfadyjameel", "perspective", "news", "video", "in-the-news", "articles" ]
    const from = (Number)(req.params.month)
    let To = 0
    if (from < 12) To = from + 1
    else To = 1
    let contentCountArray = []
    contentType.forEach(async (item, index) => {
        const query = await db.collection("News").distinct("_id", { $or: [ { type: item } ] })
        var data = await query
        let newData = []
        data.forEach((item, index) => {
            newData.push(`News$${data[index]}`)
        })
        const query2 = await db.collection("UserActionLogs").aggregate([
            { "$match": {
                $or: [ { _created_at: {
                    $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                    $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                    } }, { _updated_at: {
                        $gte: new Date(`2022-${from}-01T00:00:00.000Z`),
                        $lt: new Date(`2022-${To}-01T00:00:00.000Z`)
                    } } ] 
            }
            },
            { "$match": {
                "_p_news": { 
                    "$in": newData
                }
            } 
            }
            ,
            {"$group" : {_id: "$_p_user", userCount:{$sum:1}}}
        ])
        var data = await query2.toArray()
        contentCountArray.push({Type:item, Count: data.length})
    })

    res.send({ data: contentCountArray});
})




app.listen(8081)