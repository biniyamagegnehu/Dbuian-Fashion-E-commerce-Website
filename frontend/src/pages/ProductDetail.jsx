import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { productsAPI, reviewsAPI, ordersAPI } from "../services/api";
import { getImageUrl } from "../services/api";
import ImageGallery from "../components/products/ImageGallery";
import AnimatedButton from "../components/ui/AnimatedButton";
import GlassCard from "../components/ui/GlassCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [purchaseCheckLoading, setPurchaseCheckLoading] = useState(false);

  console.log("Product ID from URL:", id);

  // Format price in Birr
  const formatPrice = (price) => {
    return `${price} Birr`;
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  // Load product from backend
  useEffect(() => {
    const loadProductData = async () => {
      if (!id || id === "undefined") {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching product with ID:", id);

        const productResponse = await productsAPI.getById(id);
        console.log("Product response:", productResponse);

        const productData =
          productResponse.data?.product || productResponse.data;

        if (productData) {
          setProduct(productData);

          if (productData.variants && productData.variants.length > 0) {
            const firstVariant = productData.variants[0];
            setSelectedVariantId(firstVariant._id || firstVariant.id);
            setSelectedSize(firstVariant.size || "");
          } else if (productData.size && productData.size.length > 0) {
            setSelectedSize(productData.size[0]);
          }

          try {
            const reviewsResponse = await reviewsAPI.getByProduct(id);
            setReviews(reviewsResponse.data?.reviews || []);
          } catch (reviewError) {
            console.error("Error loading reviews:", reviewError);
            setReviews([]);
          }
        } else {
          setError("Product not found");
          setProduct(null);
        }
      } catch (error) {
        console.error("Error loading product:", error);
        setError(error.message || "Failed to load product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [id]);

  // Check if user has purchased this product
  useEffect(() => {
    const checkUserPurchase = async () => {
      if (isAuthenticated && user && product) {
        setPurchaseCheckLoading(true);
        try {
          const ordersResponse = await ordersAPI.getUserOrders();
          const userOrders = ordersResponse.data?.orders || [];

          const hasPurchasedProduct = userOrders.some(
            (order) =>
              order.orderStatus === "delivered" &&
              order.items.some((item) => {
                const itemProductId = item.product?._id || item.product;
                return (
                  itemProductId === product._id || itemProductId === product.id
                );
              }),
          );

          setHasPurchased(hasPurchasedProduct);
        } catch (error) {
          console.error("Error checking purchase status:", error);
          setHasPurchased(false);
        } finally {
          setPurchaseCheckLoading(false);
        }
      }
    };

    if (product) {
      checkUserPurchase();
    }
  }, [id, isAuthenticated, user, product]);

  const selectedVariant = product?.variants?.find(
    (variant) =>
      variant._id?.toString() === selectedVariantId ||
      variant.id?.toString() === selectedVariantId,
  );

  const selectedVariantStock = selectedVariant?.stock ?? product?.stock ?? 0;
  const selectedVariantPrice = selectedVariant?.price ?? product?.price ?? 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (!product) return;

    const resolvedVariantId =
      selectedVariantId ||
      product?.variants
        ?.find((variant) => variant.size === selectedSize)
        ?._id?.toString();

    addToCart(
      product,
      selectedSize,
      quantity,
      resolvedVariantId,
      selectedVariant?.color,
      selectedVariant?.sku,
    );
    navigate("/cart");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please sign in to submit a review");
      navigate("/login");
      return;
    }

    if (!hasPurchased && !purchaseCheckLoading) {
      alert("You need to purchase this product before leaving a review");
      return;
    }

    if (reviewRating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!reviewComment.trim()) {
      alert("Please write a review comment");
      return;
    }

    setReviewSubmitting(true);
    try {
      const reviewData = {
        productId: id,
        rating: reviewRating,
        comment: reviewComment,
      };

      const response = await reviewsAPI.create(reviewData);
      const newReview = response.data?.review;

      setReviews((prev) => [newReview, ...prev]);
      setReviewRating(0);
      setReviewComment("");
      setShowReviewForm(false);

      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.message || "Error submitting review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const renderStarRating = (
    rating,
    interactive = false,
    onRatingChange = null,
  ) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "div"}
            onClick={interactive ? () => onRatingChange(star) : undefined}
            className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} ${
              star <= rating ? "text-yellow-400" : "text-gray-400"
            }`}
            disabled={!interactive || reviewSubmitting}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const getReviewRequirementsMessage = () => {
    if (!isAuthenticated) {
      return {
        message: "Please sign in to leave a review",
        type: "info",
      };
    }
    if (!hasPurchased && !purchaseCheckLoading) {
      return {
        message: "You need to purchase this product before leaving a review",
        type: "warning",
      };
    }
    return null;
  };

  const requirementsMessage = getReviewRequirementsMessage();

  // Show error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <GlassCard className="p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-300 mb-4">
              Error Loading Product
            </h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <p className="text-gray-400 mb-4">
              Product ID: {id || "Not provided"}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/products")}
                className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
              >
                Browse Products
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <LoadingSpinner size="large" text="Loading product..." />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <GlassCard className="p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-300 mb-4">
              Product not found
            </h2>
            <p className="text-gray-400 mb-4">
              The product you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Back to products
            </button>
          </GlassCard>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating();

  const productImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => getImageUrl(img))
      : [getImageUrl(product.image) || "/images/placeholder.jpg"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-cyan-400 transition-colors mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ImageGallery
              images={productImages}
              activeIndex={activeImage}
              onSelect={setActiveImage}
            />
          </motion.div>

          {/* Product details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-blue-400/20 text-blue-300 text-sm rounded-full border border-blue-400/30">
                      {product.gender}
                    </span>
                    <span className="px-3 py-1 bg-purple-400/20 text-purple-300 text-sm rounded-full border border-purple-400/30">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {formatPrice(selectedVariant?.price || product.price)}
                  </span>
                  {selectedVariant?.sku && (
                    <p className="text-sm text-gray-400 mt-1">
                      SKU: {selectedVariant.sku}
                    </p>
                  )}
                </div>
              </div>

              {/* Rating Summary */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {renderStarRating(product.averageRating || averageRating)}
                  <span className="ml-2 text-cyan-400 font-semibold">
                    {product.averageRating || averageRating}
                  </span>
                  <span className="ml-2 text-gray-400">
                    ({product.numReviews || reviews.length} reviews)
                  </span>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Size selector */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {(product.variants?.length > 0
                    ? [
                        ...new Set(
                          product.variants.map((variant) => variant.size),
                        ),
                      ]
                    : product.size
                  )?.map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        if (product.variants?.length > 0) {
                          const match = product.variants.find(
                            (variant) =>
                              variant.size === size &&
                              (!selectedVariant?.color ||
                                variant.color === selectedVariant?.color),
                          );
                          setSelectedVariantId(match?._id || match?.id || "");
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-gradient-to-r from-green-400 to-emerald-400 text-gray-900 shadow-lg shadow-green-400/25"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10"
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
              {product.variants?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-white mb-3">Select Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants
                      .filter((variant) => variant.size === selectedSize)
                      .map((variant) => (
                        <motion.button
                          key={variant._id || variant.id || variant.color}
                          onClick={() => {
                            setSelectedVariantId(
                              variant._id || variant.id || "",
                            );
                            setSelectedSize(variant.size);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            selectedVariantId ===
                            (variant._id?.toString() || variant.id?.toString())
                              ? "bg-gradient-to-r from-purple-400 to-pink-400 text-gray-900 shadow-lg shadow-purple-400/25"
                              : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10"
                          }`}
                        >
                          {variant.color || "Default"}
                        </motion.button>
                      ))}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-3">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 rounded-l-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
                    disabled={quantity <= 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <span className="px-4 py-2 bg-white/5 border-y border-white/10 text-white font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(
                          selectedVariant?.stock ?? product.stock,
                          q + 1,
                        ),
                      )
                    }
                    className="p-2 rounded-r-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
                    disabled={
                      quantity >= (selectedVariant?.stock ?? product.stock)
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <span className="ml-4 text-gray-400">
                    {selectedVariant?.stock ?? product.stock} in stock
                  </span>
                </div>
              </div>

              {/* Add to cart button */}
              <AnimatedButton
                onClick={handleAddToCart}
                className="w-full py-3 text-lg mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                disabled={selectedVariantStock === 0}
              >
                {selectedVariantStock === 0
                  ? "Out of Stock"
                  : `Add to Cart - ${formatPrice(selectedVariantPrice * quantity)}`}
              </AnimatedButton>

              {/* Product details */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="font-medium text-white mb-3">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Gender:</span>
                    <p className="text-white">{product.gender}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <p className="text-white">{product.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Material:</span>
                    <p className="text-white">
                      {product.material || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Care:</span>
                    <p className="text-white">
                      {product.care || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Available Sizes:</span>
                    <p className="text-white">
                      {product.size ? product.size.join(", ") : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">SKU:</span>
                    <p className="text-white">DB-{product._id || product.id}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Reviews Section */}
            <GlassCard className="p-6 backdrop-blur-xl mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Customer Reviews
                </h2>

                {/* Write Review Button - Only show if user can review */}
                {!showReviewForm && (
                  <AnimatedButton
                    onClick={() => {
                      if (!isAuthenticated) {
                        alert("Please sign in to write a review");
                        navigate("/login");
                        return;
                      }
                      if (!hasPurchased) {
                        alert(
                          "You need to purchase this product before writing a review",
                        );
                        return;
                      }
                      setShowReviewForm(true);
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    disabled={purchaseCheckLoading}
                  >
                    {purchaseCheckLoading ? "Checking..." : "Write a Review"}
                  </AnimatedButton>
                )}
              </div>

              {/* Review Requirements Message */}
              {requirementsMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg mb-6 ${
                    requirementsMessage.type === "warning"
                      ? "bg-yellow-400/10 border border-yellow-400/20 text-yellow-300"
                      : "bg-blue-400/10 border border-blue-400/20 text-blue-300"
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {requirementsMessage.message}
                  </div>
                </motion.div>
              )}

              {/* Review Form */}
              {showReviewForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-6 bg-gray-800/30 rounded-lg border border-gray-700/50"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Write Your Review
                  </h3>
                  <form onSubmit={handleReviewSubmit}>
                    {/* Rating Selection */}
                    <div className="mb-4">
                      <label className="block text-gray-300 mb-2">
                        Your Rating
                      </label>
                      <div className="flex items-center">
                        {renderStarRating(reviewRating, true, setReviewRating)}
                        <span className="ml-3 text-cyan-400 font-medium">
                          {reviewRating > 0
                            ? `${reviewRating} out of 5`
                            : "Select rating"}
                        </span>
                      </div>
                    </div>

                    {/* Review Comment */}
                    <div className="mb-4">
                      <label
                        htmlFor="reviewComment"
                        className="block text-gray-300 mb-2"
                      >
                        Your Review
                      </label>
                      <textarea
                        id="reviewComment"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400 resize-none"
                        rows="4"
                        required
                      />
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        disabled={reviewSubmitting}
                      >
                        Cancel
                      </button>
                      <AnimatedButton
                        type="submit"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        disabled={reviewSubmitting}
                      >
                        {reviewSubmitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </div>
                        ) : (
                          "Submit Review"
                        )}
                      </AnimatedButton>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No reviews yet. Be the first to review this product!
                  </p>
                ) : (
                  reviews.map((review) => (
                    <motion.div
                      key={review._id || review.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                            {review.userName ? review.userName.charAt(0) : "U"}
                          </div>
                          <span className="text-white font-medium">
                            {review.userName || "Anonymous User"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {renderStarRating(review.rating)}
                          <span className="ml-2 text-gray-400 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
