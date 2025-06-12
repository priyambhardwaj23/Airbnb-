const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    // const {category}=req.query;
    // let listing;
    // if(category){
    //   listing=await Listing.find({category});
    // }else{
    //   listing=await Listing.find({});
    // }
    // // const allListings = await Listing.find({});
    // res.render("listings/index.ejs", {listing,category});

  const { category, search } = req.query;
  let filter = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    const regex = new RegExp(search, "i"); // case-insensitive match
    filter.$or = [
      { location: regex },
      { title: regex },
      { country: regex }
    ];
  }

  const listings = await Listing.find(filter);
  res.render("listings/index", { listings, category, search });
    

};

module.exports.renderNewForm = (req, res) => {
    //console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "...", filename);
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
    //console.log(newListing);

};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    //console.log(listing);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_256")
    res.render("listings/edit.ejs", { originalImageUrl, listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //decoustructing the listing object

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    console.log(deletedList);
    res.redirect("/listings");
};