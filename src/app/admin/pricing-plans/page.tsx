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
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Pricing Plans
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage subscription plans and feature packages
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pricing Plan
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 border border-border rounded-xl bg-card">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-base font-semibold text-foreground mb-1">
            No pricing plans found
          </p>
          <p className="text-sm text-muted-foreground">
            Create your first pricing plan using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan: any) => (
            <div
              key={plan._id}
              className="rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="bg-muted/40 border-b border-border p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                        plan.isActive
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {plan.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline">
                    <span className="text-3xl font-extrabold text-foreground">
                      {plan.currencyDisplay || "$"}{plan.finalPrice}
                    </span>
                    <span className="ml-1.5 text-sm font-medium text-muted-foreground">/{plan.duration}</span>
                  </div>
                  {plan.discountPercentage > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground line-through">
                        {plan.currencyDisplay || "$"}{plan.price}
                      </span>
                      <span className="font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {plan.discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {plan.description}
                  </p>
                  <div className="space-y-2.5 mb-4">
                    {plan.features?.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground font-medium">
                    Max: {plan.maxDownloads === -1 ? "Unlimited" : `${plan.maxDownloads} downloads`}
                  </span>
                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-2 text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted transition-colors"
                      title="Edit Plan"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="p-2 text-red-500 hover:text-red-600 rounded-lg border border-border hover:bg-red-500/10 transition-colors"
                      title="Delete Plan"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card rounded-xl border border-border max-w-2xl w-full my-8 overflow-hidden">
            <div className="p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-foreground mb-5 pb-3 border-b border-border">
                {editingPlan ? "Edit Pricing Plan" : "Add New Pricing Plan"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
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
                      className="w-full px-3.5 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
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
                      className="w-full px-3.5 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Duration *
                    </label>
                    <select
                      required
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-foreground"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
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
                      className="w-full px-3.5 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
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
                        className="flex-1 px-3.5 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-sm text-foreground placeholder:text-muted-foreground"
                      />
                      <Button
                        type="button"
                        onClick={handleAddFeature}
                        disabled={!currentFeature.trim()}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg disabled:opacity-50"
                      >
                        Add Feature
                      </Button>
                    </div>
                    {formData.features.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                          Added Features:
                        </p>
                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                          {formData.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-muted/40 px-3 py-2 rounded-lg border border-border"
                            >
                              <span className="text-sm text-foreground">
                                {feature}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFeature(index)}
                                className="text-muted-foreground hover:text-red-500 p-1 rounded transition-colors"
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
                <div className="flex items-center p-3 rounded-lg bg-muted/30 border border-border">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2.5 text-sm font-medium text-foreground cursor-pointer"
                  >
                    Active Plan
                  </label>
                </div>
                <div className="flex space-x-3 pt-4 border-t border-border">
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    variant="outline"
                    className="flex-1 rounded-lg border-border"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg"
                  >
                    {editingPlan ? "Update Plan" : "Create Plan"}
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
