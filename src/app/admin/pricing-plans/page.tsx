/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  useGetPricingPlansQuery,
  useCreatePricingPlanMutation,
  useUpdatePricingPlanMutation,
  useDeletePricingPlanMutation,
} from "@/services/api";
import { Plus, Edit, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ToastProvider";
import { useConfirm } from "@/components/ConfirmProvider";

export default function PricingPlansPage() {
  const { data, isLoading } = useGetPricingPlansQuery({});
  const [createPlan] = useCreatePricingPlanMutation();
  const [updatePlan] = useUpdatePricingPlanMutation();
  const [deletePlan] = useDeletePricingPlanMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [currentFeature, setCurrentFeature] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPercentage: 0,
    duration: "monthly",
    features: [] as string[],
    maxDownloads: 10,
    isActive: true,
  });

  const plans = data?.data || [];
  const toast = useToast();
  const confirmDialog = useConfirm();

  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, currentFeature.trim()],
      });
      setCurrentFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalPrice =
        formData.price - (formData.price * formData.discountPercentage) / 100;
      const submitData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        finalPrice,
        duration: formData.duration,
        features: formData.features,
        maxDownloads: formData.maxDownloads,
        isActive: formData.isActive,
        discountPercentage: formData.discountPercentage,
      };

      if (editingPlan) {
        await updatePlan({ id: editingPlan._id, data: submitData }).unwrap();
        toast.success("Pricing plan updated successfully!");
      } else {
        await createPlan(submitData).unwrap();
        toast.success("Pricing plan created successfully!");
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error?.data?.message || "An error occurred");
    }
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      discountPercentage: plan.discountPercentage || 0,
      duration: plan.duration,
      features: plan.features || [],
      maxDownloads: plan.maxDownloads || 10,
      isActive: plan.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const ok = await confirmDialog.confirm(
        "Are you sure you want to delete this pricing plan?",
        {
          title: "Delete pricing plan",
          confirmLabel: "Delete",
          cancelLabel: "Cancel",
        }
      );
      if (!ok) return;
      await deletePlan({ id, permanent: false }).unwrap();
      toast.success("Pricing plan deleted successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "An error occurred");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setCurrentFeature("");
    setFormData({
      name: "",
      description: "",
      price: 0,
      discountPercentage: 0,
      duration: "monthly",
      features: [],
      maxDownloads: 10,
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header - Premium Glassmorphic */}
      <div className="relative overflow-hidden rounded-3xl bg-card/95 dark:bg-[#141414]/95 backdrop-blur-xl shadow-xl dark:shadow-primary/20 border border-border/70 dark:border-[#1e1e1e]">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent pointer-events-none"></div>
        
        <div className="relative p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground dark:text-foreground">
                Pricing Plans
              </h1>
              <p className="mt-2 text-muted-foreground dark:text-muted-foreground/80">
                Manage subscription plans
              </p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-primary/70 via-primary to-primary/90 dark:from-primary/40 dark:via-primary/60 dark:to-primary/50 hover:shadow-lg dark:hover:shadow-primary/30 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Pricing Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan: any) => (
            <div
              key={plan._id}
              className="group relative bg-card/95 dark:bg-[#141414]/95 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-primary/10 border border-border/70 dark:border-[#1e1e1e] overflow-hidden hover:shadow-xl dark:hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              <div className="relative bg-gradient-to-r from-primary/70 via-primary to-primary/90 dark:from-primary/40 dark:via-primary/60 dark:to-primary/50 p-6 text-white shadow-lg dark:shadow-primary/20">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{
                    plan.currencyDisplay}{plan.finalPrice}</span>
                  <span className="ml-2 text-white/80">/{plan.duration}</span>
                </div>
                {plan.discountPercentage > 0 && (
                  <p className="mt-2 text-white/90">
                    <span className="line-through">{plan.currencyDisplay}{plan.price}</span>
                    <span className="ml-2 font-semibold bg-white/20 px-2 py-0.5 rounded-full text-sm">
                      {plan.discountPercentage}% OFF
                    </span>
                  </p>
                )}
              </div>
              <div className="relative p-6">
                <p className="text-muted-foreground dark:text-muted-foreground/80 mb-4">{plan.description}</p>
                <div className="space-y-2 mb-6">
                  {plan.features?.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary dark:text-primary/90 mr-2 flex-shrink-0" />
                      <span className="text-foreground dark:text-foreground/90">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/70 dark:border-[#1e1e1e]">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      plan.isActive
                        ? "bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/40"
                        : "bg-muted/50 dark:bg-muted/30 text-muted-foreground dark:text-muted-foreground/70 border border-border/50 dark:border-[#1e1e1e]"
                    }`}
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-2 text-primary dark:text-primary/90 hover:bg-primary/10 dark:hover:bg-primary/15 rounded-xl transition-all hover:shadow-md dark:hover:shadow-primary/20 border border-transparent hover:border-primary/30 dark:hover:border-primary/40"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="p-2 text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/15 rounded-xl transition-all hover:shadow-md dark:hover:shadow-red-500/20 border border-transparent hover:border-red-500/30 dark:hover:border-red-500/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal - Premium Dark Mode */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative bg-card/95 dark:bg-[#141414]/95 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-primary/30 border border-border/70 dark:border-[#1e1e1e] max-w-2xl w-full my-8">
            {/* Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent rounded-2xl pointer-events-none"></div>
            
            <div className="relative p-6 max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-foreground dark:text-foreground mb-6">
                {editingPlan ? "Edit Pricing Plan" : "Add New Pricing Plan"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground/90 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-background dark:bg-[#0a0a0a] border border-border/70 dark:border-[#1e1e1e] rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary/60 focus:border-transparent text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground/60 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground/90 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-background dark:bg-[#0a0a0a] border border-border/70 dark:border-[#1e1e1e] rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary/60 focus:border-transparent text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground/60 transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-foreground/90 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 bg-background dark:bg-[#0a0a0a] border border-border/70 dark:border-[#1e1e1e] rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary/60 focus:border-transparent text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground/60 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-foreground/90 mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discountPercentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountPercentage: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 bg-background dark:bg-[#0a0a0a] border border-border/70 dark:border-[#1e1e1e] rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary/60 focus:border-transparent text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground/60 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-foreground/90 mb-2">
                      Duration *
                    </label>
                    <select
                      required
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-background dark:bg-[#0a0a0a] border border-border/70 dark:border-[#1e1e1e] rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary/60 focus:border-transparent text-foreground dark:text-foreground transition-all [&>option]:bg-background [&>option]:dark:bg-[#0a0a0a] [&>option]:text-foreground [&>option]:dark:text-foreground"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-foreground/90 mb-2">
                      Max Downloads
                    </label>
                    <input
                      type="number"
                      value={formData.maxDownloads}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxDownloads: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 bg-background dark:bg-[#0a0a0a] border border-border/70 dark:border-[#1e1e1e] rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary/60 focus:border-transparent text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground/60 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-foreground/90 mb-2">
                    Features
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentFeature}
                        onChange={(e) => setCurrentFeature(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                        placeholder="Enter a feature..."
                        className="flex-1 px-4 py-2 bg-background dark:bg-[#0a0a0a] border border-border/70 dark:border-[#1e1e1e] rounded-xl focus:ring-2 focus:ring-primary dark:focus:ring-primary/60 focus:border-transparent text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground/60 transition-all"
                      />
                      <Button
                        type="button"
                        onClick={handleAddFeature}
                        disabled={!currentFeature.trim()}
                        className="px-4 py-2 bg-primary/90 dark:bg-primary/80 hover:bg-primary dark:hover:bg-primary/90 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg dark:shadow-primary/20 transition-all"
                      >
                        Add Feature
                      </Button>
                    </div>
                    {formData.features.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 font-medium">
                          Added Features:
                        </p>
                        <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                          {formData.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-muted/50 dark:bg-muted/30 backdrop-blur-sm px-3 py-2 rounded-xl border border-border/50 dark:border-[#1e1e1e] hover:bg-muted/70 dark:hover:bg-muted/40 transition-all"
                            >
                              <span className="text-sm text-foreground dark:text-foreground/90">
                                {feature}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFeature(index)}
                                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 ml-2 p-1 rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/15 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-xl bg-muted/30 dark:bg-muted/20 border border-border/50 dark:border-[#1e1e1e]">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-primary border-border/70 dark:border-[#1e1e1e] rounded focus:ring-2 focus:ring-primary dark:focus:ring-primary/60"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 text-sm font-medium text-foreground dark:text-foreground/90 cursor-pointer"
                  >
                    Active
                  </label>
                </div>
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    variant="outline"
                    className="flex-1 border-border/70 dark:border-[#1e1e1e] hover:bg-muted/50 dark:hover:bg-muted/30"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary/70 via-primary to-primary/90 dark:from-primary/40 dark:via-primary/60 dark:to-primary/50 hover:shadow-lg dark:hover:shadow-primary/30 transition-all"
                  >
                    {editingPlan ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


