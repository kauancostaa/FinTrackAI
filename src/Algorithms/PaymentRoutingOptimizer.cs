using System;
using System.Collections.Generic;
using System.Linq;

namespace FinTrackAI.Algorithms
{
    public class PaymentRoutingOptimizer
    {
        public class DijkstraRouter
        {
            private Dictionary<string, Dictionary<string, decimal>> graph = new Dictionary<string, Dictionary<string, decimal>>();
            
            public List<string> FindOptimalRoute(string start, string end)
            {
                var distances = new Dictionary<string, decimal>();
                var previous = new Dictionary<string, string>();
                var unvisited = new HashSet<string>();
                
                foreach (var node in graph.Keys)
                {
                    distances[node] = decimal.MaxValue;
                    previous[node] = null;
                    unvisited.Add(node);
                }
                
                distances[start] = 0;
                
                while (unvisited.Count > 0)
                {
                    var current = GetMinNode(unvisited, distances);
                    if (current == null || current == end) break;
                    
                    unvisited.Remove(current);
                    
                    foreach (var neighbor in graph[current])
                    {
                        if (!unvisited.Contains(neighbor.Key)) continue;
                        
                        decimal alt = distances[current] + neighbor.Value;
                        
                        if (alt < distances[neighbor.Key])
                        {
                            distances[neighbor.Key] = alt;
                            previous[neighbor.Key] = current;
                        }
                    }
                }
                
                return ReconstructPath(previous, end);
            }
            
            private string GetMinNode(HashSet<string> unvisited, Dictionary<string, decimal> distances)
            {
                string minNode = null;
                decimal minDistance = decimal.MaxValue;
                
                foreach (var node in unvisited)
                {
                    if (distances[node] < minDistance)
                    {
                        minDistance = distances[node];
                        minNode = node;
                    }
                }
                
                return minNode;
            }
            
            private List<string> ReconstructPath(Dictionary<string, string> previous, string end)
            {
                var path = new List<string>();
                var current = end;
                
                while (current != null)
                {
                    path.Insert(0, current);
                    current = previous.ContainsKey(current) ? previous[current] : null;
                }
                
                return path;
            }
        }
    }
}
